const express = require("express");
const router = express.Router();

// Logout route to clear the JWT token from cookies
router.get("/", (req, res) => {
  try {
    // Clear the JWT token from cookies
    res.clearCookie('jwt_token', { httpOnly: true, secure: true, sameSite: 'Strict' });
    return res.status(200).json({ success: true, message: "Successfully logged out" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ success: false, message: "Failed to log out" });
  }
});

module.exports = {
    path: "/auth/logout",
    router,
  };