const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.session_id = decoded.session_id;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(500).json({ success: false, message: 'Error during authentication' });
  }
};

// GET /lawjournal/entry/:id - Display a particular entry by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const db = router.locals.db;
  const entryId = req.params.id;

  try {
    // Query to get the entry by ID
    const entry = await db('LawJournalEntries')
      .select('*')
      .where({ id: entryId })
      .first();

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Entry retrieved successfully', 
      entry 
    });
  } catch (error) {
    console.error('Error retrieving entry:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving entry' 
    });
  }
});

module.exports = {
  path: '/lawjournal/entry',
  router,
};