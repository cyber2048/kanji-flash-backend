const express = require("express");
const router = express.Router();
const Kanji = require('../../models/kanji');

// Get a random Kanji
router.get("/random", async (req, res) => {
  try {
    const count = await Kanji.countDocuments();
    const random = Math.floor(Math.random() * count);
    const randomKanji = await Kanji.findOne().skip(random);

    res.json({
      symbol: randomKanji.kanji,      
      meaning: randomKanji.meaning,
      romaji: randomKanji.romaji,
      kana: randomKanji.kana,
      hint: randomKanji.hint,
      jlpt: randomKanji.jlpt
    });
  } catch (error) {
    console.error("Error fetching random Kanji:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;