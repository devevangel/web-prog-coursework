import express from "express";
import { listWorkouts, listMyWorkouts } from "../controllers/workout.js";

const workoutRouter = express.Router();

workoutRouter.route("/").get(listWorkouts);
workoutRouter.route("/me/:id").get(listMyWorkouts);

export default workoutRouter;
