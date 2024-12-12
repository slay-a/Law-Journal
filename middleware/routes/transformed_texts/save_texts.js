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

// Endpoint to save transformed text
router.post('/', authenticateToken, async (req, res) => {
  const db = router.locals.db; // Access the Knex instance
  const { session_id } = req;

  console.log("Received request to save transformed text for session_id:", session_id);

  try {
    // Retrieve user ID using session ID
    const user = await db('Users')
      .select('user_id')
      .where({ session_id })
      .first();

    if (!user) {
      return res.status(401).json({ success: false, message: 'Session ID not found' });
    }

    const { user_id: user_id } = user;
    console.log("user_id:", user_id)
    const { original_text, transformed_text, author } = req.body;

    if (!original_text || !transformed_text || !author) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Insert the data into `saved_texts` table
    await db('saved_texts').insert({
      user_id,
      original_text,
      transformed_text,
      author,
    });

    res.status(200).json({
      success: true,
      message: 'Text saved successfully.',
    });
  } catch (err) {
    console.error('Error saving text:', err);
    return res.status(500).json({
      success: false,
      message: 'Error occurred while saving the text.',
    });
  }
});

module.exports = {
  path: '/save/text',
  router,
};