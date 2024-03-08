import express from "express";
import { listWorkouts } from "../controllers/workout.js";

const workoutRouter = express.Router();

workoutRouter.route("/").get(listWorkouts);

export default workoutRouter;
