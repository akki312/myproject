const express = require('express');
const router = express.Router();

const { verifyToken } = require('../lib/util');

// Dummy login route to generate token
router.post('/login', verifyToken, (req, res) => {
  const { username, password } = req.body;
  // Validate user credentials (you should replace this with real authentication logic)
  if (username === 'user' && password === 'password') {
    const token = generateToken({ username });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

module.exports = router;
