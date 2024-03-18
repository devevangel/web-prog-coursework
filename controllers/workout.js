import fs from "fs/promises";
import uuid from "uuid-random";

export async function listWorkouts(req, res) {
  try {
    const data = await fs.readFile(
      "../web-prog-coursework/data/workouts.json",
      "utf8"
    );
    const workouts = JSON.parse(data);
    const publicWorkouts = workouts.filter(
      (workout) => workout.is_public === true
    );
    res.status(200).json({
      status: "success",
      feeds: publicWorkouts,
    });
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(400).json({
      status: "error",
      message: "Unable to retrieve profiles",
    });
  }
}

export async function listMyWorkouts(req, res) {
  try {
    const { id } = req.params;

    const data = await fs.readFile(
      "../web-prog-coursework/data/workouts.json",
      "utf8"
    );
    const jsonData = JSON.parse(data);
    const userWorkouts = jsonData.filter((workout) => workout.owner.id === id);
    res.status(200).json({
      status: "success",
      feeds: userWorkouts,
    });
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(400).json({
      status: "error",
      message: "Unable to retrieve profiles",
    });
  }
}

export async function createWorkout(req, res) {
  try {
    const id = uuid();
    const data = await fs.readFile(
      "../web-prog-coursework/data/workouts.json",
      "utf8"
    );
    const workouts = JSON.parse(data);
    const {
      title,
      description,
      targeted_areas,
      owner,
      tags,
      duration,
      level,
      is_public,
    } = req.body;

    const newWorkout = {
      id,
      title,
      likes: [],
      thumbs_up: [],
      thumps_down: [],
      description,
      targeted_areas,
      owner,
      tags,
      duration,
      level,
      is_public,
    };

    workouts.push(newWorkout);

    await fs.writeFile(
      "../web-prog-coursework/data/workouts.json",
      JSON.stringify(workouts)
    );

    res.status(201).json({
      status: "success",
      workout: newWorkout,
    });
  } catch (err) {
    console.error("Error creating workout:", err);
    res.status(400).json({
      status: "error",
      message: "Unable to create workout",
    });
  }
}
