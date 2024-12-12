const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token = req.cookies.jwt_token || req.headers['authorization']?.split(' ')[1];

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

// DELETE /lawjournal/:id - Delete a law journal entry by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  const db = router.locals.db;
  const { session_id } = req;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Entry ID is required' });
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

    // Delete the entry where the ID matches and the entry belongs to the user
    const deletedRows = await db('LawJournalEntries')
      .where({ id, user_id })
      .del();

    if (deletedRows === 0) {
      return res.status(404).json({ success: false, message: 'Entry not found or not authorized to delete' });
    }

    return res.status(200).json({
      success: true,
      message: 'Entry deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting law journal entry:', err);
    return res.status(500).json({
      success: false,
      message: 'Error occurred while deleting the law journal entry.'
    });
  }
});

module.exports = {
  path: '/lawjournal',
  router,
};