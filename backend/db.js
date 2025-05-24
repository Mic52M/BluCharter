import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Funzione per aprire il database e creare la tabella se non esiste
export async function openDb() {
  const db = await open({
    filename: './backend/bookings.db',
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      people INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return db;
} 