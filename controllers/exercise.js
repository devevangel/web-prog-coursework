import fs from 'fs/promises';

export async function listExercises(req, res) {
  try {
    const { id } = req.params;

    const data = await fs.readFile(
      '../web-prog-coursework/data/exercises.json',
      'utf8',
    );
    const exercisesData = JSON.parse(data);

    const exercises = exercisesData[id];

    res.status(200).json({
      status: 'success',
      exercises: exercises && exercises.length > 0 ? exercises : [],
    });
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(400).json({
      status: 'error',
      message: 'Unable to retrieve exercises',
    });
  }
}
