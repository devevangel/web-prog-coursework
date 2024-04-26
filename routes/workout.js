import express from 'express';
import {
  listWorkouts,
  createWorkout,
} from '../controllers/workout.js';

const workoutRouter = express.Router();

workoutRouter.route('/').get(listWorkouts).post(createWorkout);

export default workoutRouter;
