import appState from '../state.mjs';
import { postData, isArray } from './utils.mjs';
import { mountPageRouter } from './router.mjs';

const createWorkoutPage = document.querySelector('.create-workout-page');
const createWorkoutFormTemplate = document.querySelector('#create-hiit-form-template');
const createExerciseFormTemplate = document.querySelector('#create-execise-form-template');
const exerciseMiniCardTemplate = document.querySelector('#exercise-mini-card');

let submitBtn;
let addExerciseBtn;
let exercises = [];
let workoutInfo = {
  title: '',
  description: '',
  targeted_areas: [],
  tags: [],
  level: 'easy',
  is_public: false,
};
let workoutFormInfoTextWdiget;
let exerciseFormInfoTextWdiget;
let workoutFormClone;
let exerciseFormClone;

function handleDeleteExercise(clonedNode, id) {
  exercises = exercises.filter((exerciseItem) => exerciseItem.id !== id);
  clonedNode.remove();
  clearPrevMiniCards();
  renderAddedActivities();
}

function clearPrevMiniCards() {
  const miniCards = document.querySelectorAll('.exercise-mini-card');
  miniCards.forEach((miniCard) => miniCard.remove());
}

function renderAddedActivities() {
  const listHolder = exerciseFormClone.querySelector('.exercise-mini-holder');
  exercises.forEach((exerciseItem) => {
    const exerciseMiniCardClone = exerciseMiniCardTemplate.content.cloneNode(true).firstElementChild;
    const title = exerciseMiniCardClone.querySelector('.mini-card-title');
    const duration = exerciseMiniCardClone.querySelector('.mini-card-duration');
    const deleteExerciseBtn = exerciseMiniCardClone.querySelector('.remove-mini-exercise-btn');

    title.textContent = exerciseItem.title;
    duration.textContent = `Duration: ${exerciseItem.duration}`;

    deleteExerciseBtn.addEventListener('click', () => {
      handleDeleteExercise(exerciseMiniCardClone, exerciseItem.id);
    });

    listHolder.append(exerciseMiniCardClone);
  });
}

function handleAddActivity() {
  if (exerciseFormInfoTextWdiget) {
    exerciseFormInfoTextWdiget.classList.remove('error-text');
    exerciseFormInfoTextWdiget.classList.remove('info-text');
    exerciseFormInfoTextWdiget.textContent = '';
  }

  const exerciseName = exerciseFormClone.querySelector('.exercise-name');
  const exerciseGuide = exerciseFormClone.querySelector('.exercise-guide');
  const exerciseDuration = exerciseFormClone.querySelector('.exercise-duration');

  if (exerciseName.value.length === 0 || exerciseGuide.value.length === 0 || Number(exerciseDuration.value) === 0) {
    exerciseFormInfoTextWdiget.classList.add('error-text');
    exerciseFormInfoTextWdiget.textContent = 'activity requires a name, guide and duration';
  } else {
    exercises.push({
      id: exercises.length + 1,
      title: exerciseName.value,
      directions: exerciseGuide.value,
      duration: exerciseDuration.value,
    });

    exerciseName.value = '';
    exerciseGuide.value = '';
    exerciseDuration.value = 1;
    clearPrevMiniCards();
    renderAddedActivities();
  }
}

function getTotalWorkoutDuration() {
  return exercises.reduce((totalDuration, item) => totalDuration + Number(item.duration), 0);
}

function splitInputValue(inputValue) {
  const splitValues = inputValue.split('.');
  if (isArray(splitValues)) {
    return splitValues.map((item) => item.length > 0 && item.replace(/\\n/g, '').trim());
  } else {
    return [inputValue.replace(/\\n/g, '').trim()];
  }
}

function moveBackToWokroutsPage() {
  appState.upateState('path', '/workout');
  appState.upateState('appPath', '/account/workout');
  window.history.pushState(null, null, '/workout');
  unmountCreateWorkoutPage();
  mountPageRouter();
}


function getFormattedExerciseList(exerciseList) {
  const arr = exerciseList.map((item) => {
    return {
      ...item,
      directions: splitInputValue(item.directions),
    };
  });
  return arr;
}

async function handleCreateHiit() {
  if (workoutFormInfoTextWdiget) {
    workoutFormInfoTextWdiget.classList.remove('error-text');
    workoutFormInfoTextWdiget.classList.remove('info-text');
    workoutFormInfoTextWdiget.textContent = '';
  }
  const title = workoutFormClone.querySelector('.workout-title');
  const targetAreas = workoutFormClone.querySelector('.workout-target_area');
  const tags = workoutFormClone.querySelector('.workout-tag');
  const description = workoutFormClone.querySelector('.workout-desc');
  const level = workoutFormClone.querySelector('.workout-level');
  const isPublic = workoutFormClone.querySelector('.workout-status');

  if (title.value.length === 0 || exercises.length === 0) {
    workoutFormInfoTextWdiget.classList.add('error-text');
    workoutFormInfoTextWdiget.textContent = 'Workout requires a title and alteast 1 activity';
  } else {
    submitBtn.disabled = true;
    addExerciseBtn.disabled = true;
    submitBtn.textContent = 'saving';
    addExerciseBtn.textContent = 'saving';
    workoutInfo = {
      title: title.value,
      description: description.value,
      targeted_areas: targetAreas.value.split(','),
      tags: tags.value.split(','),
      level: level.value,
      is_public: isPublic.checked,
      owner: appState.state.user,
      duration: getTotalWorkoutDuration(),
      exercises: getFormattedExerciseList(exercises),
    };


    await postData('http://localhost:8080/workouts', workoutInfo, 'POST')
      .then(() => {
        moveBackToWokroutsPage();
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        submitBtn.disabled = false;
        addExerciseBtn.disabled = false;
        submitBtn.textContent = 'Save HIIT Workout';
        addExerciseBtn.textContent = 'Add Exercise';
        title.value = '';
        description.value = '';
        targetAreas.value = '';
        level.value = 'easy';
        tags.value = '';
        isPublic.value = false;
        clearPrevMiniCards();
      });
  }
}

function mountCreateWorkoutPage() {
  workoutFormClone = createWorkoutFormTemplate.content.cloneNode(true).firstElementChild;
  exerciseFormClone = createExerciseFormTemplate.content.cloneNode(true).firstElementChild;
  workoutFormInfoTextWdiget = workoutFormClone.querySelector('.form-info-text-workout');
  exerciseFormInfoTextWdiget = exerciseFormClone.querySelector('.form-info-text-exercise');
  submitBtn = workoutFormClone.querySelector('.create-workout-btn');
  addExerciseBtn = exerciseFormClone.querySelector('.add-exercise-btn');


  submitBtn.addEventListener('click', handleCreateHiit);
  addExerciseBtn.addEventListener('click', handleAddActivity);
  createWorkoutPage.append(workoutFormClone, exerciseFormClone);
  createWorkoutPage.classList.remove('hide');
}

export function unmountCreateWorkoutPage() {
  workoutFormClone.remove();
  exerciseFormClone.remove();
  clearPrevMiniCards();
  exercises = [];
  createWorkoutPage.classList.add('hide');
}

export function setupCreateWorkoutPage() {
  mountCreateWorkoutPage();
}
