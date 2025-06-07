// server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const API_KEY = process.env.API_KEY;

app.use(cors());
app.use(express.static(path.join(__dirname, './'))); // serve index.html and static files

app.get('/api/download', async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) return res.status(400).json({ status: 'error', msg: 'Missing videoId' });

  try {
    const response = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ status: 'error', msg: err.message });
  }
});

// Required port for Hugging Face Spaces
const PORT = 7860;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
