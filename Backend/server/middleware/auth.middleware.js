const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-super-secret-key';

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
