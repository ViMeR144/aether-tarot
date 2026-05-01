const express = require('express');
const { Pool }  = require('pg');
const crypto    = require('crypto');
const path      = require('path');

const app  = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

/* Инициализация таблицы */
pool.query(`
  CREATE TABLE IF NOT EXISTS reviews (
    id         SERIAL PRIMARY KEY,
    name       TEXT        NOT NULL,
    rating     INT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
    body       TEXT        NOT NULL,
    ip_hash    TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`).then(() =>
  pool.query('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS ip_hash TEXT')
).catch(err => console.error('DB init error:', err.message));

/* Хэш IP для приватного rate-limiting */
function hashIp(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  return crypto.createHash('sha256').update(ip + 'aether_tarot_salt_2024').digest('hex').slice(0, 40);
}

/* Проверка на спам/мусор в тексте */
function isSpam(text) {
  const t = text.trim();
  /* Слишком короткий */
  if (t.length < 15) return 'Слишком короткий отзыв — напиши хотя бы пару предложений';
  /* Весь текст — один повторяющийся символ/слог */
  if (/^(.)\1{9,}$/.test(t)) return 'Текст похож на спам';
  /* Слишком много заглавных (> 70% букв) */
  const letters = t.replace(/[^а-яёa-z]/gi, '');
  const upper   = t.replace(/[^А-ЯЁA-Z]/g, '');
  if (letters.length > 10 && upper.length / letters.length > 0.7) return 'Не пиши заглавными буквами';
  /* Слишком мало уникальных слов (меньше 3) */
  const words = t.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length > 4 && new Set(words).size < 3) return 'Текст отзыва выглядит как мусор';
  return null;
}

/* GET /api/reviews */
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

/* POST /api/reviews */
app.post('/api/reviews', async (req, res) => {
  try {
    const { name, rating, body } = req.body;

    /* ── 1. Базовая валидация полей ── */
    if (!name || !rating || !body)
      return res.status(400).json({ error: 'Заполни все поля' });

    const cleanName   = String(name).trim().slice(0, 60);
    const cleanBody   = String(body).trim().slice(0, 500);
    const cleanRating = Math.min(5, Math.max(1, Number(rating) | 0));

    if (cleanName.length < 2)
      return res.status(400).json({ error: 'Имя слишком короткое' });

    /* ── 2. Антиспам — контент ── */
    const spamReason = isSpam(cleanBody);
    if (spamReason)
      return res.status(400).json({ error: spamReason });

    /* ── 3. Дедупликация — одинаковый текст ── */
    const { rows: dupes } = await pool.query(
      'SELECT id FROM reviews WHERE LOWER(TRIM(body)) = LOWER(TRIM($1)) LIMIT 1',
      [cleanBody]
    );
    if (dupes.length > 0)
      return res.status(400).json({ error: 'Такой отзыв уже существует' });

    /* ── 4. Rate limit — 1 отзыв с IP за 24 часа ── */
    const ipHash = hashIp(req);
    const { rows: recent } = await pool.query(
      "SELECT id FROM reviews WHERE ip_hash = $1 AND created_at > NOW() - INTERVAL '24 hours' LIMIT 1",
      [ipHash]
    );
    if (recent.length > 0)
      return res.status(429).json({ error: 'Можно оставить только один отзыв в 24 часа' });

    /* ── 5. Сохранить ── */
    await pool.query(
      'INSERT INTO reviews (name, rating, body, ip_hash) VALUES ($1, $2, $3, $4)',
      [cleanName, cleanRating, cleanBody, ipHash]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка сервера, попробуй позже' });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Aether Tarot running on port ${PORT}`));
