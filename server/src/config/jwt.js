const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'medikiosk_super_secret_jwt_key_sih_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      abhaId: user.abhaId,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken, JWT_SECRET };
