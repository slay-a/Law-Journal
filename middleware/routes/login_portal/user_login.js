const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const db = router.locals.db;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and Password are required" });
  }

  try {
    const user = await db("Users").select("*").where({ email }).first();

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Compare plain text password (for simplicity here, though bcrypt should be used)
    if (password === user.password) {
      const session_id = uuidv4();
      const token = jwt.sign({ session_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

      // Update session_id in the database
      await db("Users").where("user_id", user.user_id).update({ session_id });

      let responseData = { jwt_token: token };

 
      // Send the JWT in an HttpOnly cookie
      res.cookie("jwt_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: { jwt_token: token },
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Error during login" });
  }
});

module.exports = {
  path: "/user/login",
  router,
};
