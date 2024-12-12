const express = require('express');
const router = express.Router();

// GET /data/questions - returns difficulty, question_text, options, correct_answer, explanation, and chapter
router.get('/', async (req, res) => {
  const db = router.locals.db;
  try {
    const questions = await db('questions')
      .select('chapter', 'difficulty', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'explanation')
      .orderBy('id', 'asc');

    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions." });
  }
});

module.exports = {
  path: "/questions/data",
  router
};