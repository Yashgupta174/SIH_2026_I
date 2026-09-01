const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const globalErrorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/appError');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const consentRoutes = require('./routes/consentRoutes');
const documentRoutes = require('./routes/documentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const triageRoutes = require('./routes/triageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const kioskRoutes = require('./routes/kioskRoutes');
const integrationRoutes = require('./routes/integrationRoutes');

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use('/api', limiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date(), service: 'MediKiosk API' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/clinical-sessions', sessionRoutes);
app.use('/api/consents', consentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/kiosks', kioskRoutes);
app.use('/api/integrations', integrationRoutes);

// Unhandled route fallback
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
