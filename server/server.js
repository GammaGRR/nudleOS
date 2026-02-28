const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const app = express();
const ROOT = path.resolve('./files');

app.use(cors());
app.use(express.json());

function safePath(virtualPath) {
  const resolved = path.resolve(ROOT, virtualPath || '');
  if (!resolved.startsWith(ROOT)) throw new Error('Path traversal detected');
  return resolved;
}

app.get('/api/files', async (req, res) => {
  try {
    const dirPath = safePath(req.query.path || '');
    const entries = await fsp.readdir(dirPath, { withFileTypes: true });

    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dirPath, entry.name);
        let stat;
        try { stat = await fsp.stat(fullPath); } catch { stat = null; }

        const isFolder = entry.isDirectory();
        return {
          name: entry.name,
          type: isFolder ? 'folder' : 'file',
          modified: stat ? stat.mtime.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }) : undefined,
          size: (!isFolder && stat) ? formatSize(stat.size) : undefined,
        };
      })
    );

    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mkdir', async (req, res) => {
  try {
    await fsp.mkdir(safePath(req.body.path), { recursive: true });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/touch', async (req, res) => {
  try {
    const p = safePath(req.body.path);
    await fsp.mkdir(path.dirname(p), { recursive: true });
    const fd = await fsp.open(p, 'a');
    await fd.close();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rename', async (req, res) => {
  try {
    await fsp.rename(safePath(req.body.oldPath), safePath(req.body.newPath));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/delete', async (req, res) => {
  try {
    const p = safePath(req.body.path);
    const stat = await fsp.stat(p);
    if (stat.isDirectory()) {
      await fsp.rm(p, { recursive: true, force: true });
    } else {
      await fsp.unlink(p);
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/copy', async (req, res) => {
  try {
    const src = safePath(req.body.src);
    const dest = safePath(req.body.dest);
    await fsp.mkdir(path.dirname(dest), { recursive: true });
    const stat = await fsp.stat(src);
    if (stat.isDirectory()) {
      await copyDir(src, dest);
    } else {
      await fsp.copyFile(src, dest);
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true });
  const entries = await fsp.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await fsp.copyFile(s, d);
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} КБ`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} МБ`;
  return `${(bytes / 1024 ** 3).toFixed(1)} ГБ`;
}

if (!fs.existsSync(ROOT)) {
  fs.mkdirSync(ROOT, { recursive: true });
  console.log(`Created directory: ${ROOT}`);
}

app.listen(3001, () => {
  console.log(`Server running on http://localhost:3001`);
  console.log(`Serving files from: ${ROOT}`);
});