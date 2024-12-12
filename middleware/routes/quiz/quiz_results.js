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

// GET /quizresults?chapter=...&difficulty=...
router.get('/', authenticateToken, async (req, res) => {
  const db = router.locals.db;
  const { session_id } = req;
  const { chapter, difficulty } = req.query;

  if (!chapter || !difficulty) {
    return res.status(400).json({ success: false, message: 'chapter and difficulty are required' });
  }

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

    // Get the most recent attempt for given chapter and difficulty
    const result = await db('quiz_results')
      .select('score', 'incorrect_questions', 'created_at')
      .where({ user_id, chapter, difficulty })
      .orderBy('created_at', 'desc')
      .first();

    if (!result) {
      return res.status(200).json({ success: true, attempt: null });
    }

    let incorrectQuestions = [];
    if (result.incorrect_questions) {
      // Check if incorrect_questions is a string or already an object
      if (typeof result.incorrect_questions === 'string') {
        try {
          incorrectQuestions = JSON.parse(result.incorrect_questions);
        } catch (parseErr) {
          console.error('Error parsing incorrect_questions:', parseErr);
          // In case parsing fails, return them as is or handle accordingly
          return res.status(500).json({
            success: false,
            message: 'Failed to parse incorrect questions data.'
          });
        }
      } else {
        // If it's already an object
        incorrectQuestions = result.incorrect_questions;
      }
    }

    return res.status(200).json({
      success: true,
      attempt: {
        score: result.score,
        incorrect_questions: incorrectQuestions,
        created_at: result.created_at
      }
    });
  } catch (err) {
    console.error('Error fetching quiz result:', err);
    return res.status(500).json({
      success: false,
      message: 'Error occurred while fetching the quiz result.'
    });
  }
});

module.exports = {
  path: '/quizresults',
  router,
};