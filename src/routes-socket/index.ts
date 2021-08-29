import { IncomingMessage } from 'http';
import { SessionData } from 'express-session';
import { Server, Socket } from 'socket.io';
import play from 'routes-socket/game/play';
import spectate from 'routes-socket/game/spectate';
import { UserDocument } from 'models/user';
import { mongoose } from '@typegoose/typegoose';
import { LobbyDocument } from 'models/lobby';
import { GameDocument } from 'models/game';

// express-session ts workaround
// https://github.com/expressjs/session/issues/799#issuecomment-761549526
declare module 'express-session' {
  interface SessionData {
    passport: { user?: string };
  }
}
interface SessionIncomingMessage extends IncomingMessage {
  session: SessionData;
  user: UserDocument;
  userID: string;
  userIndex: number;
  lobby: LobbyDocument;
  lobbyID: string;
  game: GameDocument;
}
interface SessionSocket extends Socket {
  request: SessionIncomingMessage;
}

// weird wrapper, there might exist a better solution
// https://socket.io/docs/v4/middlewares/#Compatibility-with-Express-middleware
function socketWrapper(middleware: any) {
  return (socket: Socket, next: any) => middleware(socket.request, {}, next);
}

function socketEvents(io: Server) {
  io.on('connection', (defaultSocket: Socket) => {
    const socket = <SessionSocket>defaultSocket;
    socket.request.lobbyID = `${socket.handshake.query.lobbyID}`;

    if (!socket.request.lobbyID) {
      socket.emit('status', 'Lobby not entered.');
      return socket.disconnect(true);
    }

    // join lobby
    socket.join(socket.request.lobbyID);

    // check client connection action
    switch (socket.handshake.query.action) {
      case 'play':
        return play(socket);

      case 'spectate':
        return spectate(socket);

      default:
        socket.emit('status', 'Coming soon!');
        return socket.disconnect(true);
    }
  });
}

export { SessionSocket, socketEvents, socketWrapper };
