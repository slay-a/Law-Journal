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
router.get("/", authenticateToken, async (req, res) => {
  const db = router.locals.db;
  try {
    const session_id = req.session_id;

    // Fetch user ID from session
    const user = await db("Users")
      .select("user_id")
      .where({ session_id })
      .first();

    if (!user) {
      return res.status(401).json({ message: "Session not found." });
    }

    const history = await db("saved_texts")
      .where({ user_id: user.user_id })
      .orderBy("created_at", "desc");

    res.status(200).json({ history });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Error fetching history." });
  }
});

module.exports = {
    path:"/history",
    router
}
