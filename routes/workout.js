import express from 'express';
import {
  listWorkouts,
  createWorkout,
  deleteWorkout,
  listMyWorkouts,
  likeWorkout,
  lockWorkout,
} from '../controllers/workout.js';

const workoutRouter = express.Router();

workoutRouter.route('/me/:ownerId').get(listMyWorkouts);
workoutRouter.route('/lock/:id').put(lockWorkout);
workoutRouter.route('/').get(listWorkouts).post(createWorkout);
workoutRouter.route('/:id').delete(deleteWorkout).put(likeWorkout);


export default workoutRouter;
