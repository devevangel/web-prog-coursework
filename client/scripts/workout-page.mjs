import { deleteData, fetchData, postData } from './utils.mjs';
import appState from '../state.mjs';
import { mountPageRouter } from './router.mjs';

const userWorkoutPage = document.querySelector('.public-user-workouts');
const workoutListContainer = document.createElement('section');
const workoutCardTemplate = document.querySelector('#workout-card-template');
const workoutPageNavTemplate = document.querySelector('#workout-nav-template');
const cardClones = [];
let workouts = [];
let publicWorkoutBtn;
let privateWorkoutBtn;
let workoutPageNavClone;

async function getAllWorkouts() {
  const data = await fetchData('http://localhost:8080/workouts');
  return data.workouts;
}

async function handleDeleteWorkout(id, btn, clone) {
  const data = await deleteData(`http://localhost:8080/workouts/${id}`);
  const { status } = data;
  if (status === 'success') {
    clone.remove();
    workouts = workouts.filter((workout) => workout.id !== id);
    handleShowNoWorkouts(workouts);
  }
  btn.textContent = '🗑️';
}

async function handleGetPublicWorkouts() {
  privateWorkoutBtn.classList.remove('workout-nav-active');
  publicWorkoutBtn.classList.add('workout-nav-active');

  const data = await fetchData('http://localhost:8080/workouts');
  const { status, workouts } = data;

  if (status === 'success') {
    clearPrevUICardClones();
    mountPublicWorkoutListView(workouts, 'PUBLIC');
  }
}

async function handleGetPrivateWorkouts() {
  publicWorkoutBtn.classList.remove('workout-nav-active');
  privateWorkoutBtn.classList.add('workout-nav-active');

  const data = await fetchData(`http://localhost:8080/workouts/me/${appState.state.user.id}`);
  const { status, workouts } = data;
  if (status === 'success') {
    clearPrevUICardClones();
    mountPublicWorkoutListView(workouts, 'PRIVATE');
  }
}


function moveToCreateWorkout() {
  appState.upateState('path', '/create');
  appState.upateState('appPath', '/account/workout/create');
  window.history.pushState(null, null, '/create');
  mountPageRouter();
}

function mountPageView() {
  workoutPageNavClone = workoutPageNavTemplate.content.cloneNode(true).firstElementChild;
  workoutListContainer.classList.add('workout-list', 'clone');
  userWorkoutPage.append(workoutPageNavClone, workoutListContainer);
  const createHiitBtn = workoutPageNavClone.querySelector('.custom-hiit-btn');

  publicWorkoutBtn = workoutPageNavClone.querySelector('.workout-nav-item-left');
  privateWorkoutBtn = workoutPageNavClone.querySelector('.workout-nav-item-right');

  createHiitBtn.addEventListener('click', moveToCreateWorkout);
  publicWorkoutBtn.addEventListener('click', handleGetPublicWorkouts);
  privateWorkoutBtn.addEventListener('click', handleGetPrivateWorkouts);

  userWorkoutPage.classList.remove('hide');
}

function handleOpenWorkout(workout) {
  appState.upateState('workout', workout);
  appState.upateState('path', '/view');
  appState.upateState('appPath', '/account/workout/view');
  window.history.pushState(null, null, '/view');
  mountPageRouter();
}

function moveToEditWorkout(workout) {
  appState.upateState('workout', workout);
  appState.upateState('path', '/edit');
  appState.upateState('appPath', '/account/workout/edit');
  window.history.pushState(null, null, '/edit');
  mountPageRouter();
}

async function handleMakeWorkoutPrivateOrPublic(workout, lockWidget) {
  let action;
  const prevLockStatus = lockWidget.textContent;
  const workoutCardUI = document.querySelector(`.wk-${workout.id}`);
  workoutCardUI.classList.add('hide');

  if (lockWidget.textContent === '🔒') {
    action = 'LOCK';
  } else {
    action = 'UNLOCK';
  }

  const data = await postData(`http://localhost:8080/workouts/lock/${workout.id}`, { status: action }, 'PUT');
  const { updatedWorkout, status } = data;

  if (updatedWorkout && status === 'success') {
    lockWidget.textContent = `Likes: ${updatedWorkout.likes.length}`;
    workoutCardUI.remove();
  } else {
    lockWidget.textContent = prevLockStatus;
    workoutCardUI.classList.remove('hide');
  }
}

async function handleLikeOrUnlikeWorkout(workout, likeBtn, likesTextWidget) {
  const prevLike = likeBtn.textContent;
  let action;

  if (likeBtn.textContent === '🤍') {
    likeBtn.textContent = '❤️';
    action = 'LIKE';
  } else {
    likeBtn.textContent = '🤍';
    action = 'UNLIKE';
  }


  const data = await postData(`http://localhost:8080/workouts/${workout.id}`, { userId: appState.state.user.id, action }, 'PUT');
  const { updatedWorkout, status } = data;

  if (updatedWorkout && status === 'success') {
    likesTextWidget.textContent = `Likes: ${updatedWorkout.likes.length}`;
  } else {
    likeBtn.textContent = prevLike;
  }
}

function handleShowNoWorkouts(workoutList) {
  const prevNoWorkoutText = document.querySelector('.no-workout-text');
  if (prevNoWorkoutText) {
    prevNoWorkoutText.remove();
  }


  if (workoutList.length === 0) {
    const noWorkoutsPara = document.createElement('span');
    noWorkoutsPara.classList.add('no-workout-text');
    noWorkoutsPara.textContent = 'No workouts avaliable 🙅🏽';
    workoutListContainer.append(noWorkoutsPara);
  }
}

function mountPublicWorkoutListView(workouts, scope) {
  handleShowNoWorkouts(workouts);
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
    workoutCardClone.classList.add(`wk-${workout.id}`);
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
    editBtn.textContent = '✏️';
    deleteBtn.textContent = '🗑️';
    makePublicBtn.textContent = scope === 'PUBLIC' ? '🔒' : '👁️';

    likeBtn.addEventListener('click', () => {
      handleLikeOrUnlikeWorkout(workout, likeBtn, likes);
    });

    openBtn.addEventListener('click', () => {
      handleOpenWorkout(workout);
    });

    editBtn.addEventListener('click', () => {
      if (workout.owner.id === appState.state.user.id) {
        moveToEditWorkout(workout);
      }
    });

    deleteBtn.addEventListener('click', () => {
      if (workout.owner.id === appState.state.user.id) {
        deleteBtn.textContent = 'deleting';
        handleDeleteWorkout(workout.id, deleteBtn, workoutCardClone);
      }
    });

    makePublicBtn.addEventListener('click', () => {
      if (workout.owner.id === appState.state.user.id) {
        handleMakeWorkoutPrivateOrPublic(workout, makePublicBtn);
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

function clearPrevUICardClones() {
  if (cardClones.length > 0) {
    cardClones.forEach((clone) => {
      clone.remove();
    });
  }
}

export function mountPublicserWorkoutPage() {
  userWorkoutPage.classList.remove('hide');
}

export async function setupPublicUserWorkoutPage() {
  workouts = await getAllWorkouts();
  mountPageView();
  mountPublicWorkoutListView(workouts, 'PUBLIC');
  mountPublicserWorkoutPage();
}
