const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Set up multer for file uploads (in memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token || req.headers['authorization']?.split(' ')[1];
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

// POST /upload-pdf - Upload PDF file
router.post('/', authenticateToken, upload.single('pdfFile'), async (req, res) => {
  const db = router.locals.db;
  const { session_id } = req;

  // Check if the file is uploaded
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const fileName = req.file.originalname;
  const fileData = req.file.buffer;

  try {
    // Get user_id from session_id
    const user = await db('Users')
      .select('user_id')
      .where({ session_id })
      .first();

    if (!user) {
      console.error('Session not found for session_id:', session_id);
      return res.status(401).json({ success: false, message: 'Session not found' });
    }

    const user_id = user.user_id;

    // Insert the PDF file into the database
    const [fileId] = await db('pdf_files').insert({
      user_id,
      file_name: fileName,
      file_data: fileData
    });

    console.log('File successfully uploaded with file ID:', fileId);
    res.status(200).json({ success: true, message: 'PDF uploaded successfully', file_id: fileId });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ success: false, message: 'Error uploading PDF' });
  }
});

module.exports = {
  path: '/upload-pdf',
  router,
};
