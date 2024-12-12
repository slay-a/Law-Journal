const express = require("express");
// const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  const db = router.locals.db;

  // Validate request body
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, Email, and Password are required",
    });
  }

  try {
    // Check if the email already exists
    const existingUser = await db("Users").select("*").where({ email }).first();
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please log in.",
      });
    }

    // Insert the new user into the database
    await db("Users").insert({
    //   user_id,
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      success: false,
      message: "Error during registration",
    });
  }
});

module.exports = {
  path: "/user/register",
  router,
};