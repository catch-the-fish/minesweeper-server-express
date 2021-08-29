import { Request, Response } from 'express';
import GameModel from 'models/game';
import LobbyModel from 'models/lobby';
import generateGame from 'utils/game/generate-game';

async function playSolo(req: Request, res: Response) {
  // generate game
  // use template strings to prevent array injection
  const game = generateGame({
    difficulty: `${req.body.difficulty}`,
    height: `${req.body.height}`,
    width: `${req.body.width}`,
    bombCount: `${req.body.bombCount}`,
    maxLives: `${req.body.maxLives}`
  });
  if (!game) return res.status(400).json('Invalid game settings.');

  // add user id or temp user
  const userID = req.user ? `${req.user._id}` : `${process.env.TEMP}`;
  const userIndex = 0;
  const players = new Map([[userID, userIndex]]);

  const flags = [0];
  const explosions = [0];
  const temp = userID === process.env.TEMP;

  // store game
  try {
    const newGame = new GameModel({
      temp: temp,
      height: game.get('height'),
      width: game.get('width'),
      maxLives: game.get('maxLives'),
      bombLocations: game.get('bombLocations'),
      solved: game.get('solved'),
      unsolved: game.get('unsolved'),
      players: players,
      flags: flags,
      explosions: explosions
    });
    await newGame.save();

    const newLobby = new LobbyModel({
      temp: temp,
      lobbyType: 'solo',
      playerToGame: { [userID]: newGame._id }
    });
    await newLobby.save();

    // store lobby for user if user is logged in
    if (req.user) {
      req.user.lobbies.push(newLobby._id);
      await req.user.save();
    }

    return res
      .status(200)
      .json({ lobbyType: newLobby.lobbyType, lobbyID: newLobby._id });
  } catch (err) {
    console.error(Date());
    console.error(err);
    return res.status(500).json('Error: could not create game.');
  }
}

export default playSolo;
