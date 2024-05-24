import uuid from 'uuid-random';
import { currentTime } from '../utils.js';
import dbConn from '../db.js';

/**
 * Handler for listing exercises of a workout.
 * Retrieves all exercises associated with a specific workout from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export async function listExercises(req, res) {
  try {
    const db = await dbConn;
    const { id } = req.params;
    const allExercises = await db.all('SELECT * FROM exercises WHERE workout_id = ?', id);

    res.status(200).json({
      status: 'success',
      exercises: allExercises,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 'error',
      message: 'Unable to retrieve exercises',
    });
  }
}


/**
 * Adds a list of exercises to a workout in the database.
 * @param {Array} exercises - List of exercises to be added.
 * @param {string} workoutId - ID of the workout to which the exercises will be added.
 */
export async function addExercisesToWorkout(exercises, workoutId) {
  const db = await dbConn;

  exercises.forEach(async (exercise) => {
    const newExercise = {
      id: uuid(),
      workout_id: workoutId,
      title: exercise.title,
      directions: exercise.directions,
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

/**
 * Deletes all exercises associated with a specific workout from the database.
 * @param {string} workoutId - ID of the workout whose exercises will be deleted.
 */
export async function deleteWorkoutExercises(workoutId) {
  const db = await dbConn;
  await db.run('DELETE FROM exercises WHERE workout_id = ?', workoutId);
}

/**
 * Deletes a list of exercises from the database based on their IDs.
 * @param {Array} exerciseIds - List of exercise IDs to be deleted.
 */
export async function deleteExercises(exerciseIds) {
  const db = await dbConn;
  exerciseIds.forEach(async (id) => {
    await db.run('DELETE FROM exercises WHERE id = ?', id);
  });
}

/**
 * Updates the details of a list of exercises in the database.
 * @param {Array} exercises - List of exercises with updated details.
 */
export async function updateExercises(exercises) {
  const db = await dbConn;
  exercises.forEach(async (exercise) => {
    const { id, title, directions, duration } = exercise;
    await db.run('UPDATE exercises SET title = ?, directions = ?, duration = ? WHERE id = ?', [
      title,
      directions,
      duration,
      id,
    ]);
  });
}
