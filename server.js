require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const Kanji = require('./models/kanji');
const authRoutes = require('./src/routes/auth');

const app = express();

// CORS configuration - MUST BE BEFORE OTHER MIDDLEWARE
app.use(cors({
  origin: 'http://localhost:3001', // Your React app's URL
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// Seed data from JSON file (run once)
const seedData = async () => {
  try {
    const count = await Kanji.countDocuments();
    if (count === 0) {
      fs.readFile('./src/data/kanji-data.json', 'utf8', async (err, data) => {
        if (err) throw err;
        const kanjiArray = JSON.parse(data);
        await Kanji.insertMany(kanjiArray);
        console.log('Kanji data seeded');
      });
    }
  } catch (error) {
    console.error('Seed error:', error);
  }
};
seedData();

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/saved-kanji', require('./src/routes/savedKanji'));

// Protected route example
const authMiddleware = require('./src/middleware/auth');
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is protected data', userId: req.user.id });
});

// Public kanji route
app.get('/api/kanji', async (req, res) => {
  try {
    const kanjiList = await Kanji.find().select('id kanji meaning hint romaji kana jlpt_level');
    res.json(kanjiList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kanji' });
  }
});

//backend test route
app.get('/', (req, res) => {
  res.send('KanjiFlash Backend is Running');
});


//test route
app.get('/api/kanji/test', async (req, res) => {
  try {
    const oneKanji = await Kanji.findOne();
    res.json({
      message: 'Sample kanji document',
      data: oneKanji,
      fields: Object.keys(oneKanji.toObject())
    });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});