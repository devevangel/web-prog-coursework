import { fetchData } from './utils.mjs';
import appState from '../state.mjs';

const userWorkoutPage = document.querySelector('.public-user-workouts');
const pageHeading = document.createElement('p');
const workoutListContainer = document.createElement('section');
const workoutPageNavTemplate = document.querySelector('#workout-page-nav');

async function getAllWorkouts() {
  const data = await fetchData('http://localhost:8080/workouts');
  return data.workouts;
}


function mountPageView() {
  userWorkoutPage.classList.remove('hide');
  pageHeading.classList.add('heading-text');
  workoutListContainer.classList.add('workout-list');
  pageHeading.textContent = 'Public Workouts';
  const workoutPageNavClone = workoutPageNavTemplate.content.cloneNode(true);
  const publicWorkoutBtn = workoutPageNavClone.querySelector('#public-workouts');
  const privateWorkoutBtn = workoutPageNavClone.querySelector('#private-workouts');


  publicWorkoutBtn.addEventListener('click', () => {
    privateWorkoutBtn.classList.remove('select-nav');
    publicWorkoutBtn.classList.add('select-nav');
  });

  privateWorkoutBtn.addEventListener('click', () => {
    publicWorkoutBtn.classList.remove('select-nav');
    privateWorkoutBtn.classList.add('select-nav');
  });

  userWorkoutPage.append(pageHeading, workoutPageNavClone);
  userWorkoutPage.appendChild(workoutListContainer);
}

function mountWorkoutListView(workouts) {
  const workoutCardTemplate = document.querySelector('#workout-card-template');
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
    openBtn.textContent = 'start';
    deleteBtn.textContent = 'delete';
    makePublicBtn.textContent = '🔒';
    // 🌎

    likeBtn.addEventListener('click', () => {
      console.log(workout.id);
    });

    openBtn.addEventListener('click', () => {
      console.log(workout.id);
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

export function unmountuserWorkoutPage() {
  userWorkoutPage.classList.toggle('hide');
}

export function mountuserWorkoutPage() {
  userWorkoutPage.classList.remove('hide');
}

export async function setupuserWorkoutPage() {
  const workouts = await getAllWorkouts();
  mountPageView();
  mountWorkoutListView(workouts);
  mountuserWorkoutPage();
}
