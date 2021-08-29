import { Socket } from 'socket.io';

async function spectate(socket: Socket) {
  socket.emit('status', 'Coming soon!');
  return socket.disconnect(true);
}

export default spectate;
