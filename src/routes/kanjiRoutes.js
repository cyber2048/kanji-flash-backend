const express = require("express");
const router = express.Router();
const Kanji = require("../models/kanji");

// Get a random Kanji
router.get("/random", async (req, res) => {
  try {
    const count = await Kanji.countDocuments();
    const random = Math.floor(Math.random() * count);
    const kanji = await Kanji.findOne().skip(random).lean();

    if (!kanji) return res.status(404).json({ message: "No Kanji found" });

    res.json({
      id: kanji._id,
      symbol: kanji.symbol,
      romaji: kanji.romaji,
      kana: kanji.kana,
      meaning: kanji.meaning,
      hint: kanji.hint,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;