import fs from 'fs/promises';
import uuid from 'uuid-random';

import dbConn from '../db.js';
import { currentTime } from '../utils.js';

import { addExercisesToWorkout, deleteWorkoutExercises } from './exercise.js';

export async function listWorkouts(req, res) {
  try {
    const db = await dbConn;
    const allWorkouts = await db.all('SELECT * FROM workouts ORDER BY time DESC');

    const parsedWorkouts = allWorkouts.map((item) => {
      return {
        ...item,
        tags: JSON.parse(item.tags),
        owner: JSON.parse(item.owner),
        targeted_areas: JSON.parse(item.targeted_areas),
      };
    });

    res.status(200).json({
      status: 'success',
      workouts: parsedWorkouts,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 'error',
      message: 'Unable to retrieve workouts',
    });
  }
}

export async function listMyWorkouts(req, res) {
  try {
    const { ownerId } = req.body;

    const db = await dbConn;
    const privateWorkouts = await db.get(
      'SELECT * FROM workouts WHERE owner_id = ?',
      ownerId,
    );

    const parsedWorkouts = privateWorkouts.map((item) => {
      return {
        ...item,
        tags: JSON.parse(item.tags),
        owner: JSON.parse(item.owner),
        targeted_areas: JSON.parse(item.targeted_areas),
      };
    });

    res.status(200).json({
      status: 'success',
      workouts: parsedWorkouts,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 'error',
      message: 'Unable to retrieve private workouts',
    });
  }
}

export async function createWorkout(req, res) {
  try {
    const db = await dbConn;
    const {
      title,
      description,
      targeted_areas,
      owner,
      tags,
      duration,
      level,
      is_public,
      exercises,
    } = req.body;

    const newWorkout = {
      id: uuid(),
      title,
      likes: [],
      thumbs_up: [],
      thumps_down: [],
      description,
      targeted_areas,
      owner_id: owner.id,
      owner,
      tags,
      duration,
      level,
      is_public,
      time: currentTime(),
    };

    db.run(
      'INSERT INTO workouts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newWorkout.id,
        newWorkout.title,
        newWorkout.description,
        JSON.stringify(newWorkout.targeted_areas),
        JSON.stringify(newWorkout.tags),
        JSON.stringify(newWorkout.likes),
        newWorkout.owner_id,
        JSON.stringify(newWorkout.owner),
        newWorkout.duration,
        newWorkout.level,
        newWorkout.is_public,
        newWorkout.time,
      ],
    ).then(async () => {
      await addExercisesToWorkout(exercises, newWorkout.id);
    });

    res.status(201).json({
      status: 'success',
    });
  } catch (err) {
    console.error('Error creating workout:', err);
    res.status(400).json({
      status: 'error',
      message: 'Unable to create workout',
    });
  }
}

export async function deleteWorkout(req, res) {
  try {
    const { id } = req.params;
    const data = await fs.readFile(
      '../web-prog-coursework/data/workouts.json',
      'utf8',
    );

    const jsonData = JSON.parse(data);
    const workoutToDelete = jsonData.find((workout) => workout.id === id);
    const workouts = jsonData.filter((workout) => workout.id !== id);

    await fs.writeFile(
      '../web-prog-coursework/data/workouts.json',
      JSON.stringify(workouts),
    );

    await deleteWorkoutExercises(id);

    res.status(200).json({
      status: 'success',
      workouts: workoutToDelete,
    });
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(400).json({
      status: 'error',
      message: 'Unable to delete workout',
    });
  }
}
