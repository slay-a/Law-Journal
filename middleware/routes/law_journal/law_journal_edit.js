const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token || req.headers['authorization']?.split(' ')[1];
    console.log("Cookie JWT Token:", req.cookies.jwt_token);

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { session_id } = decoded;

    if (!session_id) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    req.session_id = session_id;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired, please login again' });
    }
    return res.status(500).json({ success: false, message: 'Error during authentication' });
  }
};

// PUT /lawjournal/:id - Update a Law Journal entry
router.put('/:id', authenticateToken, async (req, res) => {
  const db = router.locals.db;
  const { session_id } = req;
  const { id } = req.params;

  const {
    section,
    question,
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

  if (!section || !question || !correct_answer || !explanation) {
    return res.status(400).json({ success: false, message: 'Required fields are missing' });
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

    // Check if the entry exists and belongs to the user
    const existingEntry = await db('LawJournalEntries')
      .where({ id, user_id })
      .first();

    if (!existingEntry) {
      return res.status(404).json({ success: false, message: 'Entry not found or access denied' });
    }

    // Update the Law Journal entry
    const updatedEntry = {
      section,
      question,
      input_type,
      attempted_answer: input_type === 'Attempted Answer' ? attempted_answer || 'N/A' : 'N/A',
      correct_answer,
      explanation,
      reason_for_mistake: reason_for_mistake || 'N/A',
      choice_a: input_type === 'Choices' ? choice_a || 'N/A' : 'N/A',
      choice_b: input_type === 'Choices' ? choice_b || 'N/A' : 'N/A',
      choice_c: input_type === 'Choices' ? choice_c || 'N/A' : 'N/A',
      choice_d: input_type === 'Choices' ? choice_d || 'N/A' : 'N/A'    };

    await db('LawJournalEntries')
      .where({ id, user_id })
      .update(updatedEntry);

    return res.status(200).json({
      success: true,
      message: 'Law journal entry updated successfully',
    });
  } catch (err) {
    console.error('Error updating law journal entry:', err);
    return res.status(500).json({
      success: false,
      message: 'Error occurred while updating the law journal entry.'
    });
  }
});

module.exports = {
  path: '/lawjournal',
  router,
};