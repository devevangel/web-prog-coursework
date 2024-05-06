import { deleteData, fetchData } from './utils.mjs';
import appState from '../state.mjs';
import { mountPageRouter } from './router.mjs';

const userWorkoutPage = document.querySelector('.public-user-workouts');
const workoutListContainer = document.createElement('section');
const workoutCardTemplate = document.querySelector('#workout-card-template');
const workoutPageNavTemplate = document.querySelector('#workout-nav-template');
const cardClones = [];
let publicWorkoutBtn;
let privateWokoutBtn;
let workoutPageNavClone;
let pageHeading;

async function getAllPublicWorkouts() {
  const data = await fetchData('http://localhost:8080/workouts');
  return data.workouts;
}

async function handleDeleteWorkout(id, btn) {
  await deleteData(`http://localhost:8080/workouts/${id}`).then(() => {
    unmountPublicUserWorkoutPage();
  }).catch((error) => {
    console.log(error);
  }).finally(() => {
    btn.textContent = 'delete';
    mountPageRouter();
  });
}

function handleGetPublicWorkouts() {
  privateWokoutBtn.classList.remove('workout-nav-active');
  publicWorkoutBtn.classList.add('workout-nav-active');
  pageHeading.textContent = 'Public Workouts';
}

function handleGetPrivateWorkouts() {
  publicWorkoutBtn.classList.remove('workout-nav-active');
  privateWokoutBtn.classList.add('workout-nav-active');
  pageHeading.textContent = 'Private Workouts';
}

function moveToCreateHiitWorkout() {
  appState.upateState('path', '/create');
  appState.upateState('appPath', '/account/workout/create');
  window.history.pushState(null, null, '/create');
  unmountPublicUserWorkoutPage();
  mountPageRouter();
}


function mountPageView() {
  if (workoutPageNavClone) {
    unmountPublicUserWorkoutPage();
  }

  workoutPageNavClone = workoutPageNavTemplate.content.cloneNode(true).firstElementChild;
  workoutListContainer.classList.add('workout-list');
  userWorkoutPage.append(workoutPageNavClone, workoutListContainer);
  pageHeading = workoutPageNavClone.querySelector('.workout-type-text');
  const createHiitBtn = workoutPageNavClone.querySelector('.custom-hiit-btn');

  publicWorkoutBtn = workoutPageNavClone.querySelector('.workout-nav-item-left');
  privateWokoutBtn = workoutPageNavClone.querySelector('.workout-nav-item-right');

  createHiitBtn.addEventListener('click', moveToCreateHiitWorkout);
  publicWorkoutBtn.addEventListener('click', handleGetPublicWorkouts);
  privateWokoutBtn.addEventListener('click', handleGetPrivateWorkouts);

  userWorkoutPage.classList.remove('hide');
}

function handleOpenWorkout(workout) {
  appState.upateState('workout', workout);
  appState.upateState('path', '/exercise');
  appState.upateState('appPath', '/account/workout/exercise');
  window.history.pushState(null, null, '/exercise');
  unmountPublicUserWorkoutPage();
  mountPageRouter();
}

function handleEditWorkout(workout) {
  console.log(workout);
}

function handleMakeWorkoutPrivateOrPublic(workout) {
  console.log(workout);
}

function handleLikeOrUnlikeWorkout(workout) {
  console.log(workout);
}

function mountPublicWorkoutListView(workouts) {
  workouts.forEach((workout) => {
    const workoutCardClone = workoutCardTemplate.content.cloneNode(true).firstElementChild;
    const title = workoutCardClone.querySelector('.workout-card-title');
    const author = workoutCardClone.querySelector('.workout-card-author');
    const about = workoutCardClone.querySelector('.workout-card-about');
    const tags = workoutCardClone.querySelector('.workout-card-tags');
    const targetedAreas = workoutCardClone.querySelector('.workout-card-target-areas');
    const duration = workoutCardClone.querySelector('.workout-card-duration');
    const level = workoutCardClone.querySelector('.workout-card-level');
    const likes = workoutCardClone.querySelector('.workout-card-likes');
    const likeBtn = workoutCardClone.querySelector('.workout-card-like-btn');
    const openBtn = workoutCardClone.querySelector('.workout-card-open-btn');
    const editBtn = workoutCardClone.querySelector('.workout-card-edit-btn');
    const deleteBtn = workoutCardClone.querySelector('.workout-card-delete-btn');
    const makePublicBtn = workoutCardClone.querySelector('.workout-card-public-btn');
    const ownerProfile = workoutCardClone.querySelector('.workout-card-profile-img');

    // setting text content
    ownerProfile.src = workout.owner.profile_img;
    ownerProfile.title = `${workout.owner.first_name} ${workout.owner.last_name}`;
    title.textContent = `Title: ${workout.title}`;
    about.textContent = `About: ${workout.description}`;
    tags.textContent = `Tags: ${workout.tags.toString()}`;
    targetedAreas.textContent = `Targeted Areas: ${workout.targeted_areas.toString()}`;
    duration.textContent = `Duration: ${workout.duration} mins`;
    author.textContent = `Author: ${workout.owner.first_name} ${workout.owner.last_name}`;
    level.textContent = `Level: ${workout.level}`;
    likes.textContent = `Likes: ${workout.likes.length}`;
    likeBtn.textContent = workout.likes.includes(appState.state.user.id) ? '❤️' : '🤍';
    openBtn.textContent = 'open';
    editBtn.textContent = '📝';
    deleteBtn.textContent = '🗑️';
    makePublicBtn.textContent = '🔒';
    // 🌎

    likeBtn.addEventListener('click', () => {
      handleLikeOrUnlikeWorkout(workout);
    });

    openBtn.addEventListener('click', () => {
      handleOpenWorkout(workout);
    });

    editBtn.addEventListener('click', () => {
      if (workout.owner.id === appState.state.user.id) {
        handleEditWorkout(workout);
      }
    });

    deleteBtn.addEventListener('click', () => {
      if (workout.owner.id === appState.state.user.id) {
        deleteBtn.textContent = 'deleting';
        handleDeleteWorkout(workout.id, deleteBtn);
      }
    });

    makePublicBtn.addEventListener('click', () => {
      if (workout.owner.id === appState.state.user.id) {
        handleMakeWorkoutPrivateOrPublic(workout);
      }
    });

    if (workout.owner.id !== appState.state.user.id) {
      makePublicBtn.classList.add('hide');
      editBtn.classList.add('hide');
      deleteBtn.classList.add('hide');
    }

    workoutListContainer.appendChild(workoutCardClone);
    cardClones.push(workoutCardClone);
  });
}

export function unmountPublicUserWorkoutPage() {
  workoutListContainer.remove();
  workoutPageNavClone.remove();
  userWorkoutPage.innerHTML = '';
  if (cardClones.length > 0) {
    cardClones.forEach((clone) => {
      clone.remove();
    });
  }
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
