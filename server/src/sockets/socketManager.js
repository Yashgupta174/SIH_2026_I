const { Server } = require('socket.io');
const logger = require('../utils/logger');

let ioInstance = null;

const initSocketIO = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  ioInstance.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on('join_triage_room', () => {
      socket.join('triage_room');
      logger.info(`Socket ${socket.id} joined triage_room`);
    });

    socket.on('join_kiosk_room', (kioskCode) => {
      socket.join(`kiosk_${kioskCode}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

const getSocketIO = () => {
  return ioInstance;
};

module.exports = { initSocketIO, getSocketIO };
