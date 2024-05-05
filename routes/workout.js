import express from 'express';
import {
  listWorkouts,
  createWorkout,
  deleteWorkout,
} from '../controllers/workout.js';

const workoutRouter = express.Router();

workoutRouter.route('/').get(listWorkouts).post(createWorkout);

workoutRouter.route('/:id').delete(deleteWorkout);

export default workoutRouter;
