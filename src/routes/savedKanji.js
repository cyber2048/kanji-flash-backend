const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const SavedKanji = require('../../models/SavedKanji');

// Get all saved kanji for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const savedKanji = await SavedKanji.find({ userId: req.user.id }).sort({ savedAt: -1 });
    res.json(savedKanji);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save a kanji
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { kanjiId, kanji, meaning, hint } = req.body;

    // Check if already saved
    const existing = await SavedKanji.findOne({ 
      userId: req.user.id, 
      kanjiId: kanjiId 
    });

    if (existing) {
      return res.status(400).json({ message: 'Kanji already saved' });
    }

    const savedKanji = new SavedKanji({
      userId: req.user.id,
      kanjiId,
      kanji,
      meaning,
      hint
    });

    await savedKanji.save();
    res.status(201).json({ message: 'Kanji saved successfully', savedKanji });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a saved kanji
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const savedKanji = await SavedKanji.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!savedKanji) {
      return res.status(404).json({ message: 'Saved kanji not found' });
    }

    res.json({ message: 'Kanji removed from saved list' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;