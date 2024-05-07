import uuid from 'uuid-random';

import dbConn from '../db.js';
import { currentTime } from '../utils.js';

import { addExercisesToWorkout, deleteWorkoutExercises } from './exercise.js';

export async function listWorkouts(req, res) {
  try {
    const db = await dbConn;
    const allWorkouts = await db.all('SELECT * FROM workouts WHERE is_public = 1 ORDER BY time DESC');

    const parsedWorkouts = allWorkouts.map((item) => {
      return {
        ...item,
        likes: JSON.parse(item.likes),
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
    const { ownerId } = req.params;

    const db = await dbConn;
    const privateWorkouts = await db.all(
      'SELECT * FROM workouts WHERE owner_id = ? AND is_public = 0',
      ownerId,
    );

    if (privateWorkouts !== undefined) {
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
    } else {
      res.status(200).json({
        status: 'success',
        workouts: [],
      });
    }
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

    await db.run(
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
    );

    await addExercisesToWorkout(exercises, newWorkout.id);


    res.status(201).json({
      status: 'success',
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 'error',
      message: 'Unable to create workout',
    });
  }
}

export async function deleteWorkout(req, res) {
  try {
    const { id } = req.params;
    const db = await dbConn;

    await db.run('DELETE FROM workouts WHERE id = ?', id);
    await deleteWorkoutExercises(id);

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: 'error',
      message: 'Unable to delete workout',
    });
  }
}

export async function likeWorkout(req, res) {
  try {
    const { userId, action } = req.body;
    const { id } = req.params;
    const db = await dbConn;

    const workoutToUpdate = await db.get('SELECT * FROM workouts WHERE id = ?', id);
    const parsedWorkoutToUpate = {
      ...workoutToUpdate,
      likes: JSON.parse(workoutToUpdate.likes),
      tags: JSON.parse(workoutToUpdate.tags),
      owner: JSON.parse(workoutToUpdate.owner),
      targeted_areas: JSON.parse(workoutToUpdate.targeted_areas),
    };
    let totalLikes = [...parsedWorkoutToUpate.likes];
    if (action === 'LIKE') {
      totalLikes.push(userId);
    } else if (action === 'UNLIKE') {
      totalLikes = totalLikes.filter((likeId) => likeId !== userId);
    }

    await db.run('UPDATE workouts SET likes = ? WHERE id = ?', [JSON.stringify(totalLikes), id]);
    const updatedWorkout = await db.get('SELECT * FROM workouts WHERE id = ?', id);
    const parsedWorkout = {
      ...updatedWorkout,
      likes: JSON.parse(updatedWorkout.likes),
      tags: JSON.parse(updatedWorkout.tags),
      owner: JSON.parse(updatedWorkout.owner),
      targeted_areas: JSON.parse(updatedWorkout.targeted_areas),
    };

    res.status(200).json({
      status: 'success',
      updatedWorkout: parsedWorkout,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'error',
      message: 'Workout like failed',
    });
  }
}
