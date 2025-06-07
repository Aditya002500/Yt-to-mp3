// server.js
const express = require('express');
const https = require('https');
const cors = require('cors');
const path = require('path');

const app = express();
const API_KEY = '3a7e9844ffmsh5d0520e908fa6e7p1da7d9jsn9d8f1e787e46';

app.use(cors());
app.use(express.static(path.join(__dirname, './'))); // serve index.html and static files

// Validate YouTube video ID
function isValidYouTubeId(id) {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}

app.get('/api/download', async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) {
    return res.status(400).json({ status: 'error', msg: 'Missing videoId' });
  }

  // Clean and validate video ID
  const cleanVideoId = videoId.split('?')[0].split('&')[0];
  if (!isValidYouTubeId(cleanVideoId)) {
    return res.status(400).json({ status: 'error', msg: 'Invalid YouTube video ID' });
  }

  const options = {
    method: 'GET',
    hostname: 'youtube-mp36.p.rapidapi.com',
    port: null,
    path: `/dl?id=${cleanVideoId}`,
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
    }
  };

  const request = https.request(options, function (response) {
    const chunks = [];

    response.on('data', function (chunk) {
      chunks.push(chunk);
    });

    response.on('end', function () {
      const body = Buffer.concat(chunks);
      try {
        const data = JSON.parse(body.toString());
        res.json(data);
      } catch (err) {
        res.status(500).json({ status: 'error', msg: 'Invalid response from API' });
      }
    });
  });

  request.on('error', function (err) {
    res.status(500).json({ status: 'error', msg: err.message });
  });

  request.end();
});

// Required port for Hugging Face Spaces
const PORT = 7860;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
