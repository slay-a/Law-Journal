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

router.post('/', authenticateToken, async (req, res) => {
    const db = router.locals.db;
    const { session_id } = req;
    const { chapter, difficulty, score, incorrect_questions } = req.body;
  
    if (chapter === undefined || difficulty === undefined || score === undefined || !Array.isArray(incorrect_questions)) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
  
    try {
      // Retrieve user ID using session ID
      const user = await db('Users')
        .select('user_id')
        .where({ session_id })
        .first();
  
      if (!user) {
        return res.status(401).json({ success: false, message: 'Session ID not found' });
      }
  
      const user_id = user.user_id;
  
      // Insert into quiz_results
      await db('quiz_results').insert({
        user_id,
        chapter,
        difficulty,
        score,
        incorrect_questions: JSON.stringify(incorrect_questions) // convert array to JSON string if column is TEXT
      });
  
      res.status(200).json({
        success: true,
        message: 'Quiz result saved successfully.',
      });
    } catch (err) {
      console.error('Error saving quiz result:', err);
      return res.status(500).json({
        success: false,
        message: 'Error occurred while saving the quiz result.',
      });
    }
  });
  
  module.exports = {
    path: '/save/quizresult',
    router,
  };
