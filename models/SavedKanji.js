const mongoose = require('mongoose');

const savedKanjiSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kanjiId: {
    type: Number,
    required: true
  },
  kanji: {
    type: String,
    required: true
  },
  meaning: {
    type: String,
    required: true
  },
  hint: {
    type: String,
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate saves
savedKanjiSchema.index({ userId: 1, kanjiId: 1 }, { unique: true });

module.exports = mongoose.model('SavedKanji', savedKanjiSchema);