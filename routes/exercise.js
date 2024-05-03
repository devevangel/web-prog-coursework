import express from 'express';
import { listExercises } from '../controllers/exercise.js';

const exerciseRouter = express.Router();

exerciseRouter.route('/:id').get(listExercises);

export default exerciseRouter;
