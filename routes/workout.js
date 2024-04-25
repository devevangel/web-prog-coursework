import express from 'express';
import {
  listWorkouts,
  listMyWorkouts,
  createWorkout,
} from '../controllers/workout.js';

const workoutRouter = express.Router();

workoutRouter.route('/').get(listWorkouts).post(createWorkout);
workoutRouter.route('/:id').get(listMyWorkouts);

export default workoutRouter;
