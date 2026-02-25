const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const DIRECTORY_PATH = path.resolve('./files');

app.get('/api/files', (req, res) => {
  fs.readdir(DIRECTORY_PATH, { withFileTypes: true }, (err, items) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read directory' });
    }

    const files = items.map((item) => ({
      name: item.name,
      type: item.isDirectory() ? 'folder' : 'file',
    }));

    res.json(files);
  });
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
