import express from 'express';
import { openDb } from '../db.js';

const router = express.Router();
const MAX_PEOPLE_PER_DAY = 8;

// GET disponibilità per una data
router.get('/availability', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Missing date' });
  const db = await openDb();
  const result = await db.get('SELECT SUM(people) as total FROM bookings WHERE date = ?', date);
  const booked = result?.total || 0;
  const spotsLeft = Math.max(0, MAX_PEOPLE_PER_DAY - booked);
  res.json({ date, spotsLeft, available: spotsLeft > 0 });
});

// POST nuova prenotazione
router.post('/book', async (req, res) => {
  const { date, people, name, email, phone } = req.body;
  if (!date || !people || !name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const db = await openDb();
  // Controlla posti disponibili
  const result = await db.get('SELECT SUM(people) as total FROM bookings WHERE date = ?', date);
  const booked = result?.total || 0;
  if (booked + people > MAX_PEOPLE_PER_DAY) {
    return res.status(409).json({ error: 'Not enough spots available' });
  }
  // Inserisci prenotazione
  await db.run(
    'INSERT INTO bookings (date, people, name, email, phone) VALUES (?, ?, ?, ?, ?)',
    date, people, name, email, phone
  );
  res.json({ success: true });
});

// (Opzionale) GET tutte le prenotazioni per una data
router.get('/bookings', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Missing date' });
  const db = await openDb();
  const bookings = await db.all('SELECT * FROM bookings WHERE date = ?', date);
  res.json({ date, bookings });
});

export default router; 