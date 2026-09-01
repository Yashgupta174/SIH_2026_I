require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');
const { initSocketIO } = require('./src/sockets/socketManager');

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
initSocketIO(server);

server.listen(PORT, () => {
  logger.info(`MediKiosk Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});
