import { findLobby } from 'models/lobby';
import { findGame, GameDocument } from 'models/game';
import { SessionSocket } from 'routes-socket';
import {
  nextTurn,
  reveal,
  flag,
  checkGameEnd,
  getGame
} from 'utils/game/actions';
import { isInteger } from 'utils/game/helpers';
import { UserDocument } from 'models/user';

interface PlayerMoves {
  action: 'reveal' | 'flag';
  row: string;
  col: string;
}

async function archiveGame(user: UserDocument | undefined, lobbyID: string) {
  // archive game if user is logged in
  if (user) {
    try {
      user.pastLobbies.push(lobbyID);
      user.lobbies.splice(user.lobbies.indexOf(lobbyID), 1);
      await user.save();
    } catch (err) {
      console.error(Date());
      console.error(err);
    }
  }
}

async function onStart(socket: SessionSocket) {
  const userIndex = socket.request.userIndex;
  const lobbyID = socket.request.lobbyID;
  const game = socket.request.game;

  if (game.end) {
    socket.emit('status', 'Game has already ended.');
    socket.emit('results', getGame(userIndex, game));
    socket.disconnect(true);
    return;
  } else if (game.start) {
    socket.emit('status', 'Game has already started.');
    return;
  }

  // set start time
  game.start = Date.now();

  // set turn to current user
  game.turnIndex = userIndex;

  // reveal top left corner
  for (const [r, v] of [
    [0, 0],
    [0, 1],
    [1, 0]
  ])
    reveal(r, v, game);

  try {
    await game.save();
  } catch (err) {
    console.error(Date());
    console.error(err);
    socket.emit('status', 'Error: cannot start game.');
    socket.disconnect(true);
    return;
  }

  // starting the game might actually end it lol
  if (checkGameEnd(userIndex, game)) {
    socket.nsp.to(lobbyID).emit('results', getGame(userIndex, game));
    await archiveGame(socket.request.user, lobbyID);
    socket.disconnect(true);
    return;
  }

  // socket.emit('status', 'Success');
  socket.nsp.to(lobbyID).emit('update', getGame(userIndex, game));
  return;
}

async function onMove(socket: SessionSocket, moves: PlayerMoves) {
  const userIndex = socket.request.userIndex;
  const lobbyID = socket.request.lobbyID;
  const game = socket.request.game;

  // verify game has not ended
  if (game.end) {
    socket.emit('status', 'Game has already ended.');
    socket.emit('results', getGame(userIndex, game));
    socket.disconnect(true);
    return;
  }

  // verify it is this player's turn
  if (game.turnIndex !== userIndex) {
    socket.emit('status', 'It is not your turn.');
    return;
  }

  // verify validity of the move
  let success = null;
  if (moves.action === 'reveal') {
    success = reveal(moves.row, moves.col, game);
  } else if (moves.action === 'flag') {
    success = flag(moves.row, moves.col, game);
  }

  // if move did not succeed, do not update
  if (!success) {
    socket.emit('status', 'Cannot make move.');
    return;
  }

  // possibly end the game
  const end = checkGameEnd(userIndex, game);

  // go to next player's turn
  if (!end) nextTurn(game);

  // save game
  try {
    await game.save();
  } catch (err) {
    console.error(Date());
    console.error(err);
    socket.emit('status', 'Error: cannot save game.');
    socket.disconnect(true);
    return;
  }

  if (end) {
    // emit results and archive game if game is over
    socket.nsp.to(lobbyID).emit('results', getGame(userIndex, game));
    await archiveGame(socket.request.user, lobbyID);
    socket.disconnect(true);
    return;
  } else {
    // emit updates if game is ongoing
    socket.nsp.to(lobbyID).emit('update', getGame(userIndex, game));
    return;
  }
}

async function play(socket: SessionSocket) {
  // get socket request variables and parse user info
  const lobbyID = socket.request.lobbyID;
  const user = socket.request.user;
  const userID = user ? `${user.id}` : `${process.env.TEMP}`;
  
  // get lobby from database
  const lobby = await findLobby(lobbyID);
  if (!lobby) {
    socket.emit('status', 'Lobby cannot be found.');
    socket.disconnect(true);
    return;
  }

  // get game from database
  const gameID = lobby.playerToGame.get(userID);
  const game = await findGame(gameID);
  if (!game) {
    socket.emit('status', 'Game cannot be found.');
    socket.disconnect(true);
    return;
  }

  // verify user
  const userIndex = game.players.get(userID);
  // note: userIndex might be 0, so we cannot just check `!userIndex`
  if (userIndex === undefined || !isInteger(userIndex)) {
    socket.emit('status', 'You cannot access this game.');
    socket.disconnect(true);
    return;
  }

  // emit results if game has ended
  if (game.end) {
    socket.emit('results', getGame(userIndex, game));
    socket.disconnect(true);
    return;
  }

  // game connection success
  socket.emit('update', getGame(userIndex, game));
  // socket.emit('status', 'Success');

  // set socket variables
  socket.request.userID = userID;
  socket.request.lobby = lobby;
  socket.request.game = game;
  socket.request.userIndex = userIndex;

  // socket on functions
  socket.on('start', () => onStart(socket));
  socket.on('move', (moves: PlayerMoves) => onMove(socket, moves));
  socket.on('disconnecting', (reason) => {
    console.log(`${userID} is disconnecting because ${reason}`);
  });
  socket.on('disconnect', (reason) => {
    console.log(`${userID} has disconnected because ${reason}`);
  });
}

export default play;
