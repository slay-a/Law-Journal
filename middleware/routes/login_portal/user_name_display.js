const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token = req.cookies.jwt_token || req.headers['authorization']?.split(' ')[1];
    console.log("Cookie JWT Token:", req.cookies.jwt_token);

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { session_id } = decoded;

    if (!session_id) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    // Attach session ID to the request object
    req.session_id = session_id;

    next();
  } catch (err) {
    console.error('Authentication error:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired, please login again',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error during authentication',
    });
  }
};

// GET /lawjournal - Retrieve all stored law journal entries for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  const db = router.locals.db;
  const { session_id } = req;

  try {
    // Retrieve user ID using session ID
    const user = await db('Users')
      .select('user_id')
      .where({ session_id })
      .first();

    if (!user) {
      return res.status(401).json({ success: false, message: 'Session not found' });
    }

    const user_id = user.user_id;

    // Retrieve all law journal entries for the authenticated user
    const name = await db('Users')
      .select('name')
      .where({ user_id })
      .orderBy('created_at', 'desc');

    if (!name || name.length === 0) {
      return res.status(200).json({ success: true, entries: [] });
    }

    return res.status(200).json({
      success: true,
      name
    });
  } catch (err) {
    console.error('Error retrieving law journal entries:', err);
    return res.status(500).json({
      success: false,
      message: 'Error occurred while retrieving law journal entries.'
    });
  }
});

module.exports = {
  path: '/user/name',
  router,
};
