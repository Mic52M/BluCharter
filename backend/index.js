import express from 'express';
import cors from 'cors';
import calendarRoutes from './routes/calendar.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', calendarRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 