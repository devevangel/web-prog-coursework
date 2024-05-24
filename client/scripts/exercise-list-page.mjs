import { fetchData } from './utils.mjs';
import { mountPageRouter } from './router.mjs';
import appState from '../state.mjs';

const exerciseListPage = document.querySelector('.exercise-list-page');
const exerciseListTemplate = document.querySelector('#exercise-list-template');
const exerciseListItemTemplate = document.querySelector('#exercise-item-template');

let exerciseListClone;

async function getAllExercises() {
  const result = await fetchData(`http://localhost:8080/exercises/${appState.state.workout.id}`);
  return result.exercises;
}

function handleStartWorkout() {
  appState.upateState('path', '/exercise');
  appState.upateState('appPath', '/account/workout/view/exercise');
  window.history.pushState(null, null, '/exercise');
  mountPageRouter();
}

function goBackToworkouts() {
  appState.upateState('path', '/workout');
  appState.upateState('appPath', '/account/workout');
  window.history.pushState(null, null, 'workout');
  mountPageRouter();
}

function mountPageView() {
  exerciseListClone = exerciseListTemplate.content.cloneNode(true).firstElementChild;
  const startWorkoutBtn = exerciseListClone.querySelector('.start-workout-btn');
  const closeBtn = exerciseListClone.querySelector('.close-exercise-list-btn');
  startWorkoutBtn.addEventListener('click', handleStartWorkout);
  closeBtn.addEventListener('click', goBackToworkouts);
  exerciseListPage.append(exerciseListClone);
}

function mountExerciseList(exercises) {
  const listView = exerciseListClone.querySelector('.exercise-list-container');
  exercises.forEach((exercise) => {
    const listItemClone = exerciseListItemTemplate.content.cloneNode(true).firstElementChild;
    const name = listItemClone.querySelector('.exercise-item-name-text');
    const guide = listItemClone.querySelector('.exercise-item-guide-text');
    const duration = listItemClone.querySelector('.exercise-item-duration-text');


    name.textContent = exercise.title;
    guide.textContent = exercise.directions;
    duration.textContent = `${exercise.duration} minute(s)`;

    listView.appendChild(listItemClone);
  });
}

export function mountExerciseListPage() {
  exerciseListPage.classList.remove('hide');
}


export async function setupExerciseListPage() {
  mountExerciseListPage();
  const exercises = await getAllExercises();
  mountPageView();
  mountExerciseList(exercises);
}
