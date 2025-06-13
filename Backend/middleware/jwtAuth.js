const { verifyToken } = require('../config/jwtConfig');

const jwtAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  try {
    // Attach user to request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Authentication error:', error);
    return res.status(500).json({ message: 'Authentication failed' });
  }
};

const optionalJwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (decoded) {
      req.user = decoded;
    }
  }
  
  next();
};

module.exports = {
  jwtAuth,
  optionalJwtAuth
};
