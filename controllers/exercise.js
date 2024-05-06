import fs from 'fs/promises';
import uuid from 'uuid-random';
import { currentTime } from '../utils.js';
import dbConn from '../db.js';

export async function listExercises(req, res) {
  try {
    const db = await dbConn;
    const { id } = req.params;
    const allExercises = await db.all('SELECT * FROM exercises WHERE workout_id = ?', id);

    const parsedExercises = allExercises.map((item) => {
      return {
        ...item,
        directions: JSON.parse(item.directions),
      };
    });

    res.status(200).json({
      status: 'success',
      exercises: parsedExercises,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 'error',
      message: 'Unable to retrieve exercises',
    });
  }
}


export async function addExercisesToWorkout(exercises, workoutId) {
  const db = await dbConn;

  exercises.forEach(async (exercise) => {
    const newExercise = {
      id: uuid(),
      workout_id: workoutId,
      title: exercise.title,
      directions: JSON.stringify(exercise.directions),
      duration: exercise.duration,
      time: currentTime(),
    };

    const res = await db.run(
      'INSERT INTO exercises VALUES (?, ?, ?, ?, ?, ?)',
      [
        newExercise.id,
        newExercise.workout_id,
        newExercise.title,
        newExercise.directions,
        newExercise.duration,
        newExercise.time,
      ],
    );

    console.log(res);
  });
}

function deleteEntry(obj, keyToRemove) {
  delete obj[keyToRemove];
  return obj;
}


export async function deleteWorkoutExercises(workoutId) {
  const data = await fs.readFile(
    '../web-prog-coursework/data/exercises.json',
    'utf8',
  );
  const exercisesData = JSON.parse(data);

  const updatedExercises = deleteEntry(exercisesData, workoutId);

  await fs.writeFile('../web-prog-coursework/data/exercises.json', JSON.stringify(updatedExercises));
}
