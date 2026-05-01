const express = require('express');
const { Pool }  = require('pg');
const crypto    = require('crypto');
const jwt       = require('jsonwebtoken');
const path      = require('path');

const app  = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

const ADMIN_SECRET   = process.env.ADMIN_SECRET   || 'aether_dev_secret_change_me';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

/* ── Инициализация БД ── */
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id         SERIAL PRIMARY KEY,
      name       TEXT        NOT NULL,
      rating     INT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
      body       TEXT        NOT NULL,
      ip_hash    TEXT,
      approved   BOOLEAN     NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await pool.query('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS ip_hash TEXT');
  await pool.query('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT true');
}
initDb().catch(err => console.error('DB init error:', err.message));

/* ── Утилиты ── */
function hashIp(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  return crypto.createHash('sha256').update(ip + 'aether_tarot_salt_2024').digest('hex').slice(0, 40);
}

function isSpam(text) {
  const t = text.trim();
  if (t.length < 15)                                    return 'Слишком короткий отзыв — напиши хотя бы пару предложений';
  if (/^(.)\1{9,}$/.test(t))                           return 'Текст похож на спам';
  const letters = t.replace(/[^а-яёa-z]/gi, '');
  const upper   = t.replace(/[^А-ЯЁA-Z]/g, '');
  if (letters.length > 10 && upper.length / letters.length > 0.7) return 'Не пиши заглавными буквами';
  const words = t.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length > 4 && new Set(words).size < 3)     return 'Текст отзыва выглядит как мусор';
  return null;
}

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Нет токена' });
  try {
    jwt.verify(token, ADMIN_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Токен недействителен' });
  }
}

/* ════════════════════════════════════
   ПУБЛИЧНЫЕ МАРШРУТЫ
════════════════════════════════════ */

app.get('/api/reviews', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, rating, body, created_at FROM reviews WHERE approved = true ORDER BY created_at DESC LIMIT 50'
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'db error' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { name, rating, body } = req.body;
    if (!name || !rating || !body) return res.status(400).json({ error: 'Заполни все поля' });

    const cleanName   = String(name).trim().slice(0, 60);
    const cleanBody   = String(body).trim().slice(0, 500);
    const cleanRating = Math.min(5, Math.max(1, Number(rating) | 0));

    if (cleanName.length < 2) return res.status(400).json({ error: 'Имя слишком короткое' });

    const spamReason = isSpam(cleanBody);
    if (spamReason) return res.status(400).json({ error: spamReason });

    const { rows: dupes } = await pool.query(
      'SELECT id FROM reviews WHERE LOWER(TRIM(body)) = LOWER(TRIM($1)) LIMIT 1', [cleanBody]
    );
    if (dupes.length > 0) return res.status(400).json({ error: 'Такой отзыв уже существует' });

    const ipHash = hashIp(req);
    const { rows: recent } = await pool.query(
      "SELECT id FROM reviews WHERE ip_hash = $1 AND created_at > NOW() - INTERVAL '24 hours' LIMIT 1", [ipHash]
    );
    if (recent.length > 0) return res.status(429).json({ error: 'Можно оставить только один отзыв в 24 часа' });

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

/* ════════════════════════════════════
   АДМИН — АВТОРИЗАЦИЯ
════════════════════════════════════ */

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Неверный пароль' });
  const token = jwt.sign({ admin: true }, ADMIN_SECRET, { expiresIn: '12h' });
  res.json({ token });
});

/* ════════════════════════════════════
   АДМИН — СТАТИСТИКА
════════════════════════════════════ */

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const [total, approved, today, avgRow, byRating] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM reviews'),
      pool.query('SELECT COUNT(*) FROM reviews WHERE approved = true'),
      pool.query("SELECT COUNT(*) FROM reviews WHERE created_at > NOW() - INTERVAL '24 hours'"),
      pool.query('SELECT ROUND(AVG(rating)::numeric, 1) AS avg FROM reviews WHERE approved = true'),
      pool.query('SELECT rating, COUNT(*) FROM reviews WHERE approved = true GROUP BY rating ORDER BY rating'),
    ]);
    res.json({
      total:    parseInt(total.rows[0].count),
      approved: parseInt(approved.rows[0].count),
      hidden:   parseInt(total.rows[0].count) - parseInt(approved.rows[0].count),
      today:    parseInt(today.rows[0].count),
      avg:      parseFloat(avgRow.rows[0].avg) || 0,
      byRating: byRating.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'db error' });
  }
});

/* ════════════════════════════════════
   АДМИН — ОТЗЫВЫ
════════════════════════════════════ */

app.get('/api/admin/reviews', requireAdmin, async (req, res) => {
  try {
    const search = req.query.q ? `%${req.query.q}%` : null;
    const query  = search
      ? 'SELECT * FROM reviews WHERE name ILIKE $1 OR body ILIKE $1 ORDER BY created_at DESC'
      : 'SELECT * FROM reviews ORDER BY created_at DESC';
    const { rows } = await pool.query(query, search ? [search] : []);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'db error' });
  }
});

/* Удалить отзыв */
app.delete('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = $1', [parseInt(req.params.id)]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'db error' });
  }
});

/* Скрыть / показать отзыв */
app.patch('/api/admin/reviews/:id/toggle', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE reviews SET approved = NOT approved WHERE id = $1 RETURNING approved',
      [parseInt(req.params.id)]
    );
    res.json({ approved: rows[0].approved });
  } catch (err) {
    res.status(500).json({ error: 'db error' });
  }
});

/* Удалить все скрытые */
app.delete('/api/admin/reviews/hidden/all', requireAdmin, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM reviews WHERE approved = false');
    res.json({ deleted: rowCount });
  } catch (err) {
    res.status(500).json({ error: 'db error' });
  }
});

/* ════════════════════════════════════
   СТРАНИЦЫ
════════════════════════════════════ */

app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('*',      (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Aether Tarot running on port ${PORT}`));
