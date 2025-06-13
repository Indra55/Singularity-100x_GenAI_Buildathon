const jwt = require('jsonwebtoken');
const pool = require('./dbConfig');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      role: 'user' // Add any additional user data you need
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Middleware to protect routes
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (decoded) {
      try {
        // Fetch user from database
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
        if (result.rows.length > 0) {
          req.user = result.rows[0];
          return next();
        }
      } catch (error) {
        console.error('Database error during authentication:', error);
      }
    }
  }
  
  return res.status(401).json({ message: 'Unauthorized' });
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateJWT
};
