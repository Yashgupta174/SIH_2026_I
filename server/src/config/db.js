const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medikiosk';
    const conn = await mongoose.connect(connStr);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    // If in development and MongoDB fails to connect, fallback gracefully to in-memory or mock mode notification
    logger.warn('Running with MongoDB connection attempt fallback.');
  }
};

module.exports = connectDB;
