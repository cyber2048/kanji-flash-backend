const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  console.log('=== AUTH MIDDLEWARE DEBUG ===');
  console.log('Full Authorization Header:', authHeader);
  
  const token = authHeader?.replace('Bearer ', '');
  console.log('Extracted Token:', token);

  // Check if no token
  if (!token) {
    console.log('❌ No token found in request');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded successfully:', decoded);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};