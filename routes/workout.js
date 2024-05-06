import express from 'express';
import {
  listWorkouts,
  createWorkout,
  deleteWorkout,
  listMyWorkouts,
} from '../controllers/workout.js';

const workoutRouter = express.Router();

workoutRouter.route('/me').get(listMyWorkouts);

workoutRouter.route('/').get(listWorkouts).post(createWorkout);

workoutRouter.route('/:id').delete(deleteWorkout);

export default workoutRouter;
