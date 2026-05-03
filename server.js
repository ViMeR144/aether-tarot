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
const USER_SECRET    = process.env.USER_SECRET    || (ADMIN_SECRET + '_user');
const BOT_USERNAME   = process.env.BOT_USERNAME   || '';

const MAJOR_ARCANA = [
  { name: 'Дурак',           meaning: 'Новые начала, спонтанность, свобода духа' },
  { name: 'Маг',             meaning: 'Сила воли, мастерство, проявление желаний' },
  { name: 'Верховная Жрица', meaning: 'Интуиция, тайное знание, внутренний голос' },
  { name: 'Императрица',     meaning: 'Плодородие, красота, изобилие' },
  { name: 'Император',       meaning: 'Власть, стабильность, структура' },
  { name: 'Иерофант',        meaning: 'Традиции, духовное руководство, мудрость' },
  { name: 'Влюблённые',      meaning: 'Выбор, гармония, единство душ' },
  { name: 'Колесница',       meaning: 'Победа, решимость, движение вперёд' },
  { name: 'Сила',            meaning: 'Внутренняя мощь, смелость, терпение' },
  { name: 'Отшельник',       meaning: 'Уединение, поиск истины, мудрость пути' },
  { name: 'Колесо Фортуны',  meaning: 'Судьба, перемены, циклы жизни' },
  { name: 'Справедливость',  meaning: 'Баланс, истина, карма' },
  { name: 'Повешенный',      meaning: 'Пауза, новый взгляд, жертва ради роста' },
  { name: 'Смерть',          meaning: 'Трансформация, завершение, перерождение' },
  { name: 'Умеренность',     meaning: 'Терпение, равновесие, исцеление' },
  { name: 'Дьявол',          meaning: 'Оковы, соблазн, скрытые силы' },
  { name: 'Башня',           meaning: 'Внезапные перемены, откровение, разрушение старого' },
  { name: 'Звезда',          meaning: 'Надежда, вдохновение, обновление' },
  { name: 'Луна',            meaning: 'Иллюзии, подсознание, тайные страхи' },
  { name: 'Солнце',          meaning: 'Радость, успех, жизненная сила' },
  { name: 'Суд',             meaning: 'Пробуждение, возрождение, новый этап' },
  { name: 'Мир',             meaning: 'Завершение, достижение, единство' },
];

const ZODIAC_ARCHETYPES = {
  aries:       { ru:'Овен',     symbol:'♈', card:'Император',      desc:'Ты воплощаешь волю и власть. Твой путь — лидерство и созидание.' },
  taurus:      { ru:'Телец',    symbol:'♉', card:'Иерофант',       desc:'Мудрость традиций течёт сквозь тебя. Ты хранитель вечных истин.' },
  gemini:      { ru:'Близнецы', symbol:'♊', card:'Дурак',          desc:'Свобода и любопытство — твои крылья. Каждый день — новое приключение.' },
  cancer:      { ru:'Рак',      symbol:'♋', card:'Луна',           desc:'Интуиция — твой фонарь в темноте. Ты чувствуешь то, чего не видят другие.' },
  leo:         { ru:'Лев',      symbol:'♌', card:'Солнце',         desc:'Ты свет среди теней. Твоя энергия согревает всех вокруг.' },
  virgo:       { ru:'Дева',     symbol:'♍', card:'Отшельник',      desc:'Поиск истины — смысл твоего пути. Мудрость рождается в тишине.' },
  libra:       { ru:'Весы',     symbol:'♎', card:'Справедливость', desc:'Гармония и баланс — твоя природа. Ты видишь все стороны бытия.' },
  scorpio:     { ru:'Скорпион', symbol:'♏', card:'Смерть',         desc:'Трансформация — твой дар. Из пепла ты рождаешься заново.' },
  sagittarius: { ru:'Стрелец',  symbol:'♐', card:'Колесо Фортуны', desc:'Судьба благосклонна к искателям. Твоя стрела всегда летит вперёд.' },
  capricorn:   { ru:'Козерог',  symbol:'♑', card:'Мир',            desc:'Настойчивость — твоя суперсила. Ты достигаешь вершин, которые другим не по силам.' },
  aquarius:    { ru:'Водолей',  symbol:'♒', card:'Звезда',         desc:'Ты видишь будущее. Твой взгляд озаряет дорогу для всего человечества.' },
  pisces:      { ru:'Рыбы',     symbol:'♓', card:'Верховная Жрица',desc:'Мистика и глубина — твоя стихия. Ты слышишь голос вселенной.' },
};

app.use(express.json());
app.use(express.static(path.join(__dirname)));

/* ══════════════════════════════════════
   ИНИЦИАЛИЗАЦИЯ БД
══════════════════════════════════════ */
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id          SERIAL PRIMARY KEY,
      name        TEXT        NOT NULL,
      rating      INT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
      body        TEXT        NOT NULL,
      ip_hash     TEXT,
      approved    BOOLEAN     NOT NULL DEFAULT true,
      pinned      BOOLEAN     NOT NULL DEFAULT false,
      admin_reply TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await pool.query('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS ip_hash    TEXT');
  await pool.query('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS approved   BOOLEAN NOT NULL DEFAULT true');
  await pool.query('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS pinned     BOOLEAN NOT NULL DEFAULT false');
  await pool.query('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS admin_reply TEXT');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS banned_ips (
      id         SERIAL PRIMARY KEY,
      ip_hash    TEXT        UNIQUE NOT NULL,
      reason     TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_logs (
      id         SERIAL PRIMARY KEY,
      action     TEXT        NOT NULL,
      details    TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS page_views (
      date   DATE PRIMARY KEY DEFAULT CURRENT_DATE,
      visits INT  NOT NULL DEFAULT 0
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    )
  `);
  await pool.query(`
    INSERT INTO site_settings (key, value) VALUES
      ('bot_link',          'https://t.me/AetherTaarot_bot'),
      ('cta_text',          'НАЧАТЬ РАСКЛАД СЕЙЧАС'),
      ('tg_notify_token',   ''),
      ('tg_notify_chat_id', '')
    ON CONFLICT DO NOTHING
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tg_users (
      id          SERIAL PRIMARY KEY,
      telegram_id BIGINT      UNIQUE NOT NULL,
      username    TEXT,
      first_name  TEXT,
      photo_url   TEXT,
      zodiac      TEXT,
      agreed_at   TIMESTAMPTZ,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await pool.query('ALTER TABLE tg_users ADD COLUMN IF NOT EXISTS zodiac       TEXT');
  await pool.query('ALTER TABLE tg_users ADD COLUMN IF NOT EXISTS birth_date  DATE');

  await pool.query('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS telegram_id BIGINT');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS card_pulls (
      id          SERIAL PRIMARY KEY,
      telegram_id BIGINT NOT NULL,
      date        DATE   NOT NULL DEFAULT CURRENT_DATE,
      card_name   TEXT   NOT NULL,
      card_meaning TEXT  NOT NULL,
      UNIQUE (telegram_id, date)
    )
  `);
}
initDb().catch(err => console.error('DB init error:', err.message));

/* ══════════════════════════════════════
   УТИЛИТЫ
══════════════════════════════════════ */
function hashIp(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  return crypto.createHash('sha256').update(ip + 'aether_tarot_salt_2024').digest('hex').slice(0, 40);
}

function isSpam(text) {
  const t = text.trim();
  if (t.length < 15) return 'Слишком короткий отзыв — напиши хотя бы пару предложений';
  if (/^(.)\1{9,}$/.test(t)) return 'Текст похож на спам';
  const letters = t.replace(/[^а-яёa-z]/gi, '');
  const upper   = t.replace(/[^А-ЯЁA-Z]/g, '');
  if (letters.length > 10 && upper.length / letters.length > 0.7) return 'Не пиши заглавными буквами';
  const words = t.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length > 4 && new Set(words).size < 3) return 'Текст отзыва выглядит как мусор';
  return null;
}

function requireAdmin(req, res, next) {
  const auth  = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Нет токена' });
  try {
    const payload = jwt.verify(token, ADMIN_SECRET);
    if (!payload.admin) return res.status(403).json({ error: 'Нет доступа' });
    next();
  } catch { res.status(401).json({ error: 'Токен недействителен' }); }
}

function requireUser(req, res, next) {
  const auth  = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Нет токена' });
  try { req.tgUser = jwt.verify(token, USER_SECRET); next(); }
  catch { res.status(401).json({ error: 'Токен недействителен' }); }
}

function verifyTelegramAuth(data) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  if (!botToken) return false;
  const { hash, ...fields } = data;
  const checkStr = Object.keys(fields).sort().map(k => `${k}=${fields[k]}`).join('\n');
  const secret   = crypto.createHash('sha256').update(botToken).digest();
  const hmac     = crypto.createHmac('sha256', secret).update(checkStr).digest('hex');
  const age      = Math.floor(Date.now() / 1000) - parseInt(fields.auth_date || 0);
  return hmac === hash && age < 86400;
}

async function addLog(action, details) {
  await pool.query('INSERT INTO admin_logs (action, details) VALUES ($1, $2)', [action, details || null])
    .catch(() => {});
}

async function getSettings() {
  const { rows } = await pool.query('SELECT key, value FROM site_settings');
  return Object.fromEntries(rows.map(r => [r.key, r.value]));
}

async function sendTgNotification(review) {
  try {
    const s = await getSettings();
    if (!s.tg_notify_token || !s.tg_notify_chat_id) return;
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const text  = `⭐ Новый отзыв на сайте!\n\n👤 ${review.name}\n${stars}\n\n💬 ${review.body}\n\n🔗 Управление: /admin`;
    await fetch(`https://api.telegram.org/bot${s.tg_notify_token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: s.tg_notify_chat_id, text, parse_mode: 'HTML' }),
    });
  } catch {}
}

/* ══════════════════════════════════════
   СЧЁТЧИК ВИЗИТОВ
══════════════════════════════════════ */
app.use((req, res, next) => {
  if (req.method === 'GET' && (req.path === '/' || req.path === '/index.html')) {
    pool.query(`
      INSERT INTO page_views (date, visits) VALUES (CURRENT_DATE, 1)
      ON CONFLICT (date) DO UPDATE SET visits = page_views.visits + 1
    `).catch(() => {});
  }
  next();
});

/* ══════════════════════════════════════
   ПУБЛИЧНЫЕ МАРШРУТЫ
══════════════════════════════════════ */

app.get('/api/reviews', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, name, rating, body, admin_reply, pinned, created_at
      FROM reviews WHERE approved = true
      ORDER BY pinned DESC, created_at DESC LIMIT 50
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

app.post('/api/reviews', async (req, res) => {
  try {
    // Require Telegram login
    const auth = req.headers.authorization || '';
    const tok  = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    let telegramId = null;
    if (tok) {
      try { telegramId = jwt.verify(tok, USER_SECRET).tg_id; } catch {}
    }
    if (!telegramId) return res.status(401).json({ error: 'Войди через Telegram, чтобы оставить отзыв', needAuth: true });

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

    const { rows: banned } = await pool.query(
      'SELECT id FROM banned_ips WHERE ip_hash = $1 LIMIT 1', [ipHash]
    );
    if (banned.length > 0) return res.status(403).json({ error: 'Возможность оставлять отзывы ограничена' });

    const { rows: recent } = await pool.query(
      "SELECT id FROM reviews WHERE telegram_id = $1 AND created_at > NOW() - INTERVAL '24 hours' LIMIT 1", [telegramId]
    );
    if (recent.length > 0) return res.status(429).json({ error: 'Можно оставить только один отзыв в 24 часа' });

    const { rows: inserted } = await pool.query(
      'INSERT INTO reviews (name, rating, body, ip_hash, telegram_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [cleanName, cleanRating, cleanBody, ipHash, telegramId]
    );

    sendTgNotification(inserted[0]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка сервера, попробуй позже' });
  }
});

/* ══════════════════════════════════════
   АДМИН — AUTH
══════════════════════════════════════ */

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Неверный пароль' });
  const token = jwt.sign({ admin: true }, ADMIN_SECRET, { expiresIn: '12h' });
  addLog('LOGIN', 'Вход в панель');
  res.json({ token });
});

/* ══════════════════════════════════════
   АДМИН — СТАТИСТИКА И АНАЛИТИКА
══════════════════════════════════════ */

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const [total, approved, today, avgRow, byRating, dailyRevs, dailyViews, bansCount] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM reviews'),
      pool.query('SELECT COUNT(*) FROM reviews WHERE approved = true'),
      pool.query("SELECT COUNT(*) FROM reviews WHERE created_at > NOW() - INTERVAL '24 hours'"),
      pool.query('SELECT ROUND(AVG(rating)::numeric,1) AS avg FROM reviews WHERE approved = true'),
      pool.query('SELECT rating, COUNT(*) FROM reviews WHERE approved = true GROUP BY rating ORDER BY rating'),
      pool.query(`
        SELECT DATE(created_at) AS date, COUNT(*) AS count
        FROM reviews WHERE created_at > NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at) ORDER BY date
      `),
      pool.query(`
        SELECT date, visits FROM page_views
        WHERE date > CURRENT_DATE - INTERVAL '30 days'
        ORDER BY date
      `),
      pool.query('SELECT COUNT(*) FROM banned_ips'),
    ]);
    res.json({
      total:      parseInt(total.rows[0].count),
      approved:   parseInt(approved.rows[0].count),
      hidden:     parseInt(total.rows[0].count) - parseInt(approved.rows[0].count),
      today:      parseInt(today.rows[0].count),
      avg:        parseFloat(avgRow.rows[0].avg) || 0,
      bans:       parseInt(bansCount.rows[0].count),
      byRating:   byRating.rows,
      dailyRevs:  dailyRevs.rows,
      dailyViews: dailyViews.rows,
    });
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

/* ══════════════════════════════════════
   АДМИН — ОТЗЫВЫ
══════════════════════════════════════ */

app.get('/api/admin/reviews', requireAdmin, async (req, res) => {
  try {
    const search = req.query.q ? `%${req.query.q}%` : null;
    const { rows } = await pool.query(
      search
        ? 'SELECT * FROM reviews WHERE name ILIKE $1 OR body ILIKE $1 ORDER BY pinned DESC, created_at DESC'
        : 'SELECT * FROM reviews ORDER BY pinned DESC, created_at DESC',
      search ? [search] : []
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

/* Удалить */
app.delete('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rows } = await pool.query('SELECT name FROM reviews WHERE id = $1', [id]);
    await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
    addLog('DELETE', `Удалён отзыв #${id} от "${rows[0]?.name}"`);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

/* Скрыть / показать */
app.patch('/api/admin/reviews/:id/toggle', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rows } = await pool.query(
      'UPDATE reviews SET approved = NOT approved WHERE id = $1 RETURNING approved, name', [id]
    );
    addLog('TOGGLE', `Отзыв #${id} от "${rows[0].name}": ${rows[0].approved ? 'показан' : 'скрыт'}`);
    res.json({ approved: rows[0].approved });
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

/* Закрепить / открепить */
app.patch('/api/admin/reviews/:id/pin', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rows } = await pool.query(
      'UPDATE reviews SET pinned = NOT pinned WHERE id = $1 RETURNING pinned, name', [id]
    );
    addLog('PIN', `Отзыв #${id} от "${rows[0].name}": ${rows[0].pinned ? 'закреплён' : 'откреплён'}`);
    res.json({ pinned: rows[0].pinned });
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

/* Редактировать */
app.patch('/api/admin/reviews/:id/edit', requireAdmin, async (req, res) => {
  try {
    const id   = parseInt(req.params.id);
    const { name, body, rating } = req.body;
    await pool.query(
      'UPDATE reviews SET name = COALESCE($1, name), body = COALESCE($2, body), rating = COALESCE($3, rating) WHERE id = $4',
      [name || null, body || null, rating ? Math.min(5, Math.max(1, Number(rating) | 0)) : null, id]
    );
    addLog('EDIT', `Отредактирован отзыв #${id}`);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

/* Ответ администратора */
app.patch('/api/admin/reviews/:id/reply', requireAdmin, async (req, res) => {
  try {
    const id    = parseInt(req.params.id);
    const reply = req.body.reply ? String(req.body.reply).trim().slice(0, 500) : null;
    await pool.query('UPDATE reviews SET admin_reply = $1 WHERE id = $2', [reply, id]);
    addLog('REPLY', `Ответ на отзыв #${id}`);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

/* Удалить все скрытые */
app.delete('/api/admin/reviews/hidden/all', requireAdmin, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM reviews WHERE approved = false');
    addLog('BULK_DELETE', `Удалено скрытых отзывов: ${rowCount}`);
    res.json({ deleted: rowCount });
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

/* Экспорт CSV */
app.get('/api/admin/reviews/export', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, rating, body, approved, pinned, created_at FROM reviews ORDER BY created_at DESC');
    const header = 'ID,Имя,Оценка,Текст,Статус,Закреплён,Дата\n';
    const csv = rows.map(r =>
      `${r.id},"${r.name.replace(/"/g,'""')}",${r.rating},"${r.body.replace(/"/g,'""')}",${r.approved ? 'видимый' : 'скрыт'},${r.pinned ? 'да' : 'нет'},"${new Date(r.created_at).toLocaleString('ru-RU')}"`
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="reviews.csv"');
    res.send('﻿' + header + csv);
    addLog('EXPORT', 'Экспорт отзывов в CSV');
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

/* ══════════════════════════════════════
   АДМИН — БАНЫ
══════════════════════════════════════ */

app.get('/api/admin/bans', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM banned_ips ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

app.post('/api/admin/bans', requireAdmin, async (req, res) => {
  try {
    const { ip_hash, reason } = req.body;
    if (!ip_hash) return res.status(400).json({ error: 'ip_hash required' });
    await pool.query(
      'INSERT INTO banned_ips (ip_hash, reason) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [ip_hash, reason || null]
    );
    addLog('BAN', `Заблокирован IP ${ip_hash.slice(0,12)}…`);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

app.delete('/api/admin/bans/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM banned_ips WHERE id = $1', [parseInt(req.params.id)]);
    addLog('UNBAN', `Разблокирован бан #${req.params.id}`);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

/* ══════════════════════════════════════
   АДМИН — ЛОГИ
══════════════════════════════════════ */

app.get('/api/admin/logs', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 200');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

/* ══════════════════════════════════════
   АДМИН — НАСТРОЙКИ
══════════════════════════════════════ */

app.get('/api/admin/settings', requireAdmin, async (req, res) => {
  try { res.json(await getSettings()); }
  catch (err) { res.status(500).json({ error: 'db error' }); }
});

app.put('/api/admin/settings', requireAdmin, async (req, res) => {
  try {
    const allowed = ['bot_link', 'cta_text', 'tg_notify_token', 'tg_notify_chat_id'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        await pool.query(
          'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
          [key, String(req.body[key])]
        );
      }
    }
    addLog('SETTINGS', 'Обновлены настройки сайта');
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'db error' }); }
});

/* Тест Telegram */
app.post('/api/admin/settings/test-tg', requireAdmin, async (req, res) => {
  try {
    await sendTgNotification({ name: 'Тест', rating: 5, body: 'Это тестовое уведомление от Aether Admin ✦' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: String(err) }); }
});

/* ══════════════════════════════════════
   ПУБЛИЧНЫЙ КОНФИГ
══════════════════════════════════════ */

app.get('/api/config', (req, res) => {
  res.json({ bot_username: BOT_USERNAME });
});

/* ══════════════════════════════════════
   AUTH — TELEGRAM LOGIN
══════════════════════════════════════ */

app.post('/api/auth/telegram', async (req, res) => {
  try {
    if (!verifyTelegramAuth(req.body))
      return res.status(401).json({ error: 'Неверная подпись Telegram' });

    const { id: telegram_id, first_name, username, photo_url } = req.body;
    const { rows } = await pool.query(`
      INSERT INTO tg_users (telegram_id, username, first_name, photo_url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (telegram_id) DO UPDATE SET
        username   = EXCLUDED.username,
        first_name = EXCLUDED.first_name,
        photo_url  = EXCLUDED.photo_url
      RETURNING *
    `, [telegram_id, username || null, first_name || null, photo_url || null]);

    const user  = rows[0];
    const token = jwt.sign(
      { tg_id: user.telegram_id, name: user.first_name, agreed: !!user.agreed_at },
      USER_SECRET,
      { expiresIn: '30d' }
    );
    res.json({ token, agreed: !!user.agreed_at, user: { first_name: user.first_name, photo_url: user.photo_url } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/auth/agree', requireUser, async (req, res) => {
  try {
    await pool.query('UPDATE tg_users SET agreed_at = NOW() WHERE telegram_id = $1', [req.tgUser.tg_id]);
    const token = jwt.sign(
      { tg_id: req.tgUser.tg_id, name: req.tgUser.name, agreed: true },
      USER_SECRET,
      { expiresIn: '30d' }
    );
    res.json({ ok: true, token });
  } catch (err) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

app.get('/api/auth/me', requireUser, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT telegram_id, first_name, username, photo_url, agreed_at FROM tg_users WHERE telegram_id = $1',
      [req.tgUser.tg_id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

/* ══════════════════════════════════════
   ПРОФИЛЬ
══════════════════════════════════════ */

app.get('/api/profile', requireUser, async (req, res) => {
  try {
    const id = req.tgUser.tg_id;
    const [userRow, reviews, cardRow, historyRow] = await Promise.all([
      pool.query('SELECT * FROM tg_users WHERE telegram_id = $1', [id]),
      pool.query('SELECT id, name, rating, body, approved, created_at FROM reviews WHERE telegram_id = $1 ORDER BY created_at DESC', [id]),
      pool.query('SELECT * FROM card_pulls WHERE telegram_id = $1 AND date = CURRENT_DATE', [id]),
      pool.query('SELECT card_name, card_meaning, date FROM card_pulls WHERE telegram_id = $1 ORDER BY date DESC LIMIT 30', [id]),
    ]);
    if (!userRow.rows.length) return res.status(404).json({ error: 'Пользователь не найден' });

    /* Calculate streak */
    const history = historyRow.rows;
    let streak = 0;
    const today = new Date(); today.setHours(0,0,0,0);
    for (let i = 0; i < history.length; i++) {
      const d = new Date(history[i].date); d.setHours(0,0,0,0);
      const expected = new Date(today); expected.setDate(today.getDate() - i);
      if (d.getTime() === expected.getTime()) streak++;
      else break;
    }

    res.json({
      user:       userRow.rows[0],
      reviews:    reviews.rows,
      card_today: cardRow.rows[0] || null,
      card_history: history,
      streak,
    });
  } catch (err) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

app.put('/api/profile/zodiac', requireUser, async (req, res) => {
  const VALID = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
  const { zodiac } = req.body;
  if (!VALID.includes(zodiac)) return res.status(400).json({ error: 'Неверный знак зодиака' });
  await pool.query('UPDATE tg_users SET zodiac = $1 WHERE telegram_id = $2', [zodiac, req.tgUser.tg_id]);
  res.json({ ok: true });
});

app.put('/api/profile/birthdate', requireUser, async (req, res) => {
  try {
    const { birth_date } = req.body;
    if (!birth_date || !/^\d{4}-\d{2}-\d{2}$/.test(birth_date)) return res.status(400).json({ error: 'Неверный формат даты' });
    const d = new Date(birth_date);
    if (isNaN(d) || d > new Date()) return res.status(400).json({ error: 'Неверная дата' });
    await pool.query('UPDATE tg_users SET birth_date = $1 WHERE telegram_id = $2', [birth_date, req.tgUser.tg_id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

app.post('/api/profile/card-of-day', requireUser, async (req, res) => {
  try {
    const id = req.tgUser.tg_id;
    const { rows: existing } = await pool.query(
      'SELECT * FROM card_pulls WHERE telegram_id = $1 AND date = CURRENT_DATE', [id]
    );
    if (existing.length) return res.json(existing[0]);
    const card = MAJOR_ARCANA[Math.floor(Math.random() * MAJOR_ARCANA.length)];
    const { rows } = await pool.query(
      'INSERT INTO card_pulls (telegram_id, card_name, card_meaning) VALUES ($1, $2, $3) RETURNING *',
      [id, card.name, card.meaning]
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

app.delete('/api/profile/reviews/:id', requireUser, async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = $1 AND telegram_id = $2', [parseInt(req.params.id), req.tgUser.tg_id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

app.delete('/api/profile', requireUser, async (req, res) => {
  try {
    const id = req.tgUser.tg_id;
    await pool.query('DELETE FROM card_pulls WHERE telegram_id = $1', [id]);
    await pool.query('UPDATE reviews SET telegram_id = NULL WHERE telegram_id = $1', [id]);
    await pool.query('DELETE FROM tg_users WHERE telegram_id = $1', [id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

/* ══════════════════════════════════════
   СТРАНИЦЫ
══════════════════════════════════════ */
app.get('/admin',           (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/agreement',       (req, res) => res.sendFile(path.join(__dirname, 'agreement.html')));
app.get('/agreement/terms', (req, res) => res.redirect('/agreement'));
app.get('/profile',         (req, res) => res.sendFile(path.join(__dirname, 'profile.html')));
app.get('*',                (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Aether Tarot running on port ${PORT}`));
