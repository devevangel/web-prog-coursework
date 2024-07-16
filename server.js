import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

// Routes
import workoutRouter from './routes/workout.js';
import exerciseRouter from './routes/exercise.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.static('client', { extensions: ['html'] }));
app.use(express.json());

// Mounted routes
app.use('/workouts', workoutRouter);
app.use('/exercises', exerciseRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`listening on port ${port}`));
