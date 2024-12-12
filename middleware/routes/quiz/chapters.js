const express = require('express');
const router = express.Router();

// GET /data/chapters - returns all distinct chapters
router.get('/', async (req, res) => {
  const db = router.locals.db;
  try {
    const chapters = await db('questions')
      .distinct('chapter')
      .orderBy('chapter', 'asc');
      
    // Extract just the chapter values
    const chapterList = chapters.map(ch => ch.chapter);
    res.status(200).json({ chapters: chapterList });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res.status(500).json({ message: "Error fetching chapters." });
  }
});


module.exports = {
  path: "/chapters/data",
  router
};
