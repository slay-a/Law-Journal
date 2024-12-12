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
      console.log("No token provided");
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { session_id } = decoded;

    if (!session_id) {
      console.log("Invalid token payload");
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    // Attach session ID to the request object
    req.session_id = session_id;
    console.log("Session ID successfully attached to request:", session_id);

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

// POST /lawjournal - Add new law journal entry
router.post('/', authenticateToken, async (req, res) => {
  const db = router.locals.db;
  const { session_id } = req;
  console.log("Session ID in POST request:", session_id);
  const {
    section,
    question,
    question_type,
    input_type,
    attempted_answer,
    correct_answer,
    explanation,
    reason_for_mistake,
    choice_a,
    choice_b,
    choice_c,
    choice_d
  } = req.body;

  console.log("Request Body:", req.body);

  if (!section || !question || !question_type || !correct_answer || !explanation) {
    console.log("Required fields are missing");
    return res.status(400).json({ success: false, message: 'Required fields are missing' });
  }

  try {
    // Retrieve user ID using session ID
    const user = await db('Users')
      .select('user_id')
      .where({ session_id })
      .first();

    console.log("User retrieved from DB:", user);

    if (!user) {
      console.log("Session not found for user");
      return res.status(401).json({ success: false, message: 'Session not found' });
    }

    const user_id = user.user_id;

    // Insert the new law journal entry
    const newEntry = {
      section,
      question,
      question_type,
      input_type: input_type || 'N/A',
      attempted_answer: input_type === 'Attempted Answer' ? attempted_answer || 'N/A' : 'N/A',
      correct_answer,
      explanation,
      reason_for_mistake: reason_for_mistake || 'N/A',
      choice_a: input_type === 'Choices' ? choice_a || 'N/A' : 'N/A',
      choice_b: input_type === 'Choices' ? choice_b || 'N/A' : 'N/A',
      choice_c: input_type === 'Choices' ? choice_c || 'N/A' : 'N/A',
      choice_d: input_type === 'Choices' ? choice_d || 'N/A' : 'N/A',
      user_id
    };

    console.log("Inserting new entry into DB:", newEntry);

    const [entryId] = await db('LawJournalEntries').insert(newEntry);

    console.log("Entry successfully inserted with ID:", entryId);

    return res.status(201).json({
      success: true,
      message: 'Law journal entry created successfully',
      entry_id: entryId
    });
  } catch (err) {
    console.error('Error inserting law journal entry:', err);
    return res.status(500).json({
      success: false,
      message: 'Error occurred while inserting the law journal entry.'
    });
  }
});

module.exports = {
  path: '/lawjournal',
  router,
};