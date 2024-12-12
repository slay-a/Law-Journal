const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
      }

      const { session_id } = decoded;

      // Attach session_id to request for further use
      req.session_id = session_id;

      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ success: false, message: 'Error during authentication' });
  }
};

module.exports = {
  path: "/authenticateToken",
  router
};