import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
dotenv.config();

// Routes
import accountRouter from "./routes/account.js";
import workoutRouter from "./routes/workout.js";

const app = express();
app.use(cors());
app.use(express.static("client", { extensions: ["html"] }));
app.use(express.json());

// Mounted routes
app.use("/accounts", accountRouter);
app.use("/workouts", workoutRouter);

const port = process.env.PORT;
app.listen(port, () => console.log(`listening on port ${port}`));
