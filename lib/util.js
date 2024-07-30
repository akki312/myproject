const jwt = require('jsonwebtoken');
const secretKey = '77911'; // Replace with your secret key

// Function to generate a token
function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
}

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Access Denied: No Token Provided!');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Access Denied: Invalid Token!');
    }
    req.user = decoded;
    next();
  });
}

module.exports = {
  generateToken,
  verifyToken
};
