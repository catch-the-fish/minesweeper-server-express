import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import passport from 'passport';

import passportConfig from 'config/passport';
import database from 'config/database';
import router from 'routes-express/index';
import { socketEvents, socketWrapper } from 'routes-socket/index';

// create sessions middleware
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
  // set up sessions table in database
  store: MongoStore.create({ client: database }),
  cookie: {
    secure: process.env.DEV ? false : true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day in ms
  }
});

// set up passport
passportConfig(passport);

// create express server
const expressApp = express();

// create http server
const httpServer = createServer(expressApp);

// trust first proxy
expressApp.set('trust proxy', 1);
// use session middleware in express
expressApp.use(sessionMiddleware);
// enable cross-origin resource sharing
expressApp.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,POST',
    optionsSuccessStatus: 200,
    credentials: true
  })
);
// use express built-in body-parser
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
// use passport middleware for express
expressApp.use(passport.initialize());
expressApp.use(passport.session());
// use custom routes
expressApp.use(router);

// create socket server
const socketServer = new Server(httpServer, {
  path: `${process.env.API_ROUTE}/socket`,
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});
// use passport middleware for socketio
socketServer.use(socketWrapper(sessionMiddleware));
socketServer.use(socketWrapper(passport.initialize()));
socketServer.use(socketWrapper(passport.session()));
socketEvents(socketServer);

httpServer.listen(process.env.PORT, () => {
  console.log(`Listening at http://localhost:${process.env.PORT}`);
});
