import { fetchData } from './utils.mjs';
import appState from '../state.mjs';
import { mountPageRouter } from './router.mjs';

const userWorkoutPage = document.querySelector('.public-user-workouts');
const pageHeading = document.createElement('p');
const workoutListContainer = document.createElement('section');
const workoutCardTemplate = document.querySelector('#workout-card-template');

async function getAllPublicWorkouts() {
  const data = await fetchData('http://localhost:8080/workouts');
  return data.workouts;
}


function mountPageView() {
  userWorkoutPage.classList.remove('hide');
  pageHeading.classList.add('heading-text');
  workoutListContainer.classList.add('workout-list');
  pageHeading.textContent = 'Public Workouts';
  userWorkoutPage.append(pageHeading, workoutListContainer);
}

function handleOpenWorkout(workout) {
  appState.upateState('workout', workout);
  appState.upateState('path', '/exercise');
  appState.upateState('appPath', '/account/workout/exercise');
  window.history.pushState(null, null, '/exercise');
  unmountPublicUserWorkoutPage();
  mountPageRouter();
}

function mountPublicWorkoutListView(workouts) {
  workouts.forEach((workout) => {
    const workoutCardClone = workoutCardTemplate.content.cloneNode(true).firstElementChild;
    const title = workoutCardClone.querySelector('.workout-card-title');
    const about = workoutCardClone.querySelector('.workout-card-about');
    const tags = workoutCardClone.querySelector('.workout-card-tags');
    const targetedAreas = workoutCardClone.querySelector('.workout-card-target-areas');
    const duration = workoutCardClone.querySelector('.workout-card-duration');
    const level = workoutCardClone.querySelector('.workout-card-level');
    const likes = workoutCardClone.querySelector('.workout-card-likes');
    const likeBtn = workoutCardClone.querySelector('.workout-card-like-btn');
    const openBtn = workoutCardClone.querySelector('.workout-card-open-btn');
    const deleteBtn = workoutCardClone.querySelector('.workout-card-delete-btn');
    const makePublicBtn = workoutCardClone.querySelector('.workout-card-public-btn');

    // setting text content
    title.textContent = `Title: ${workout.title}`;
    about.textContent = `About: ${workout.description}`;
    tags.textContent = `Tags: ${workout.tags.toString()}`;
    targetedAreas.textContent = `Targeted Areas: ${workout.targeted_areas.toString()}`;
    duration.textContent = `Duration: ${workout.duration} mins`;
    level.textContent = `Level: ${workout.level}`;
    likes.textContent = `Likes: ${workout.likes.length}`;
    likeBtn.textContent = '❤️';
    openBtn.textContent = 'open';
    deleteBtn.textContent = 'delete';
    makePublicBtn.textContent = '🔒';
    // 🌎

    likeBtn.addEventListener('click', () => {
      console.log(workout.id);
    });

    openBtn.addEventListener('click', () => {
      handleOpenWorkout(workout);
    });

    deleteBtn.addEventListener('click', () => {
      console.log(workout.id);
    });

    makePublicBtn.addEventListener('click', () => {
      console.log(workout.id);
    });

    if (workout.likes.includes(appState.state.user.id)) {
      deleteBtn.classList.add('hide');
    }

    if (workout.owner.id !== appState.state.user.id) {
      makePublicBtn.classList.add('hide');
    }

    workoutListContainer.appendChild(workoutCardClone);
  });
}

function unmountPublicUserWorkoutPage() {
  userWorkoutPage.classList.add('hide');
}

export function mountPublicserWorkoutPage() {
  userWorkoutPage.classList.remove('hide');
}

export async function setupPublicUserWorkoutPage() {
  const workouts = await getAllPublicWorkouts();
  mountPageView();
  mountPublicWorkoutListView(workouts);
  mountPublicserWorkoutPage();
}
