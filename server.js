const express = require('express');
const { Pool }  = require('pg');
const path      = require('path');

const app  = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

/* Создать таблицу при старте */
pool.query(`
  CREATE TABLE IF NOT EXISTS reviews (
    id         SERIAL PRIMARY KEY,
    name       TEXT        NOT NULL,
    rating     INT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
    body       TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`).catch(err => console.error('DB init error:', err.message));

/* GET /api/reviews — последние 50 одобренных */
app.get('/api/reviews', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, rating, body, created_at FROM reviews ORDER BY created_at DESC LIMIT 50'
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'db error' });
  }
});

/* POST /api/reviews — добавить отзыв */
app.post('/api/reviews', async (req, res) => {
  try {
    const { name, rating, body } = req.body;
    if (!name || !rating || !body) return res.status(400).json({ error: 'missing fields' });
    await pool.query(
      'INSERT INTO reviews (name, rating, body) VALUES ($1, $2, $3)',
      [String(name).slice(0, 60), Math.min(5, Math.max(1, Number(rating) | 0)), String(body).slice(0, 500)]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'db error' });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Aether Tarot running on port ${PORT}`));
