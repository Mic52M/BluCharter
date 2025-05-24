const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // per immagini base64
app.use(express.static(path.join(__dirname)));

const REVIEWS_FILE = path.join(__dirname, 'reviews.json');
const PENDING_REVIEWS_FILE = path.join(__dirname, 'pending_reviews.json');

// Helper: leggi recensioni
function readReviews() {
    if (!fs.existsSync(REVIEWS_FILE)) return [];
    const data = fs.readFileSync(REVIEWS_FILE, 'utf8');
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}
// Helper: salva recensioni
function saveReviews(reviews) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8');
}
// Helper: leggi pending reviews
function readPendingReviews() {
    if (!fs.existsSync(PENDING_REVIEWS_FILE)) return [];
    const data = fs.readFileSync(PENDING_REVIEWS_FILE, 'utf8');
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}
// Helper: salva pending reviews
function savePendingReviews(reviews) {
    fs.writeFileSync(PENDING_REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8');
}

// GET tutte le recensioni
app.get('/api/reviews', (req, res) => {
    res.json(readReviews());
});

// POST nuova recensione
app.post('/api/reviews', (req, res) => {
    const { name, rating, text, images, date } = req.body;
    if (!name || !rating || !text) {
        return res.status(400).json({ error: 'Dati mancanti' });
    }
    const pending = readPendingReviews();
    const newReview = {
        name,
        rating,
        text,
        images: images || [],
        date: date || new Date().toISOString().slice(0, 10)
    };
    pending.unshift(newReview); // aggiungi in cima
    savePendingReviews(pending);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server recensioni avviato su http://localhost:${PORT}`);
}); 