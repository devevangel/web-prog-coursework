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

    await db.run(
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
  });
}

export async function deleteWorkoutExercises(workoutId) {
  const db = await dbConn;
  await db.run('DELETE FROM exercises WHERE workout_id = ?', workoutId);
}
