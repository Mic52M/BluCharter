# BoatSite Backend

Backend per la gestione delle prenotazioni e disponibilità del calendario.

## Stack

- Node.js + Express
- SQLite (file locale)

## Setup

1. **Installa le dipendenze**
   ```bash
   cd backend
   npm install
   ```
2. **Avvia il server**
   ```bash
   npm start
   ```
   Il server parte su `http://localhost:3001`

## Struttura database

- Tabella `bookings`:
  - `id` (INTEGER, PK)
  - `date` (TEXT, formato YYYY-MM-DD)
  - `people` (INTEGER)
  - `name` (TEXT)
  - `email` (TEXT)
  - `phone` (TEXT, opzionale)
  - `created_at` (TIMESTAMP)

## API

### Verifica disponibilità

```
GET /api/availability?date=YYYY-MM-DD
```

**Risposta:**

```json
{
  "date": "2025-05-20",
  "spotsLeft": 5,
  "available": true
}
```

### Crea prenotazione

```
POST /api/book
Content-Type: application/json
{
  "date": "2025-05-20",
  "people": 3,
  "name": "Mario Rossi",
  "email": "mario@email.it",
  "phone": "123456789"
}
```

**Risposta:**

```json
{ "success": true }
```

### (Opzionale) Lista prenotazioni per data

```
GET /api/bookings?date=YYYY-MM-DD
```

## Logica prenotazione

- Ogni data ha un massimo di **8 posti** disponibili.
- Se la somma delle persone prenotate supera 8, la prenotazione viene rifiutata.
- I dati vengono salvati in un database locale SQLite (`bookings.db`).

---

**Pronto per essere collegato al frontend!**
