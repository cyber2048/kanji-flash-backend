const mongoose = require('mongoose');
const kanjiSchema = new mongoose.Schema({
  id: Number,
  kanji: String,
  meaning: String,
  hint: String
});
module.exports = mongoose.model('Kanji', kanjiSchema);