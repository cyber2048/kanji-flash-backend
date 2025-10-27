const mongoose = require('mongoose');
const kanjiSchema = new mongoose.Schema({
id: {
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

  //when I added these 3 new fields in my collection, i needed to re-seed by dropping the collection(table)
  romaji: {
    type: [String],
    default: []  
  },
  kana: {
    type: [String],
    default: []  // Default to empty array if not provided
  },
  jlpt_level: {
    type: String,
    default: ''  // Default to empty string if not provided
  }
}, {
  // This ensures virtual fields and all fields are included in JSON
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

kanjiSchema.index({ id: 1 });
kanjiSchema.index({ jlpt_level: 1 });

module.exports = mongoose.model('Kanji', kanjiSchema);