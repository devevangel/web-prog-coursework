import appState from '../state.mjs';
import { postData, fetchData } from './utils.mjs';
import { mountPageRouter } from './router.mjs';

const createWorkoutPage = document.querySelector('.create-workout-page');
const createWorkoutFormTemplate = document.querySelector('#hiit-form-template');
const createExerciseFormTemplate = document.querySelector('#exercise-form-template');
const exerciseMiniCardTemplate = document.querySelector('#exercise-mini-card');


let submitBtn;
let addExerciseBtn;
let addRestBtn;
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
let isEdit = false;
let activityToEditId;

async function getAllExercisesForWorkout() {
  const result = await fetchData(`http://localhost:8080/exercises/${appState.state.workout.id}`);
  return result.exercises;
}


function handleDeleteExercise(clonedNode, id) {
  exercises = exercises.filter((exerciseItem) => exerciseItem.id !== id);
  clonedNode.remove();
  clearPrevMiniCards();
  renderAddedActivities();
}

function handleEditExercise(exercise) {
  const exerciseName = exerciseFormClone.querySelector('.exercise-name');
  const exerciseGuide = exerciseFormClone.querySelector('.exercise-guide');
  const exerciseDuration = exerciseFormClone.querySelector('.exercise-duration');

  addExerciseBtn.textContent = 'Save Edit';
  exerciseName.value = exercise.title;
  exerciseDuration.value = exercise.duration;
  exerciseGuide.value = exercise.directions;
  activityToEditId = exercise.id;
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
    const editExerciseBtn = exerciseMiniCardClone.querySelector('.edit-mini-btn');
    const deleteExerciseBtn = exerciseMiniCardClone.querySelector('.delete-mini-btn');

    title.textContent = exerciseItem.title;
    duration.textContent = `Duration(mins): ${exerciseItem.duration}`;

    deleteExerciseBtn.addEventListener('click', () => {
      handleDeleteExercise(exerciseMiniCardClone, exerciseItem.id);
    });

    editExerciseBtn.addEventListener('click', () => {
      isEdit = true;
      handleEditExercise(exerciseItem);
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
    if (isEdit) {
      isEdit = false;
      addExerciseBtn.textContent = 'Add Exercise';
      exercises.forEach((item) => {
        if (item.id === activityToEditId) {
          item.title = exerciseName.value;
          item.duration = exerciseDuration.value;
          item.directions = exerciseGuide.value;
        }
      });

      exerciseName.value = '';
      exerciseGuide.value = '';
      exerciseDuration.value = 1;
      clearPrevMiniCards();
      renderAddedActivities();
      return;
    }


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

function handleAddRestActivity() {
  exercises.push({
    id: exercises.length + 1,
    title: 'Rest',
    directions: 'Take some rest',
    duration: 1,
  });

  clearPrevMiniCards();
  renderAddedActivities();
}

function getTotalWorkoutDuration() {
  return exercises.reduce((totalDuration, item) => totalDuration + Number(item.duration), 0);
}

function moveBackToWokroutsPage() {
  appState.upateState('path', '/workout');
  appState.upateState('appPath', '/account/workout');
  window.history.pushState(null, null, '/workout');
  unmountCreateWorkoutPage();
  mountPageRouter();
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
      exercises,
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

function returnBool(val) {
  if (val === 1) return true;

  if (val === 0) return false;
}

async function setupEditView() {
  exercises = await getAllExercisesForWorkout();
  const workoutToEdit = appState.state.workout;
  clearPrevMiniCards();
  renderAddedActivities();

  const workoutFormHeading = workoutFormClone.querySelector('.workout-form-heading');
  workoutFormHeading.textContent = `Edit: ${appState.state.workout.title}`;

  const title = workoutFormClone.querySelector('.workout-title');
  const targetAreas = workoutFormClone.querySelector('.workout-target_area');
  const tags = workoutFormClone.querySelector('.workout-tag');
  const description = workoutFormClone.querySelector('.workout-desc');
  const level = workoutFormClone.querySelector('.workout-level');
  const isPublic = workoutFormClone.querySelector('.workout-status');


  title.value = workoutToEdit.title;
  targetAreas.value = workoutToEdit.targeted_areas.toString();
  tags.value = workoutToEdit.tags.toString();
  level.value = workoutToEdit.level;
  description.value = workoutToEdit.description;
  isPublic.checked = returnBool(workoutToEdit.is_public);
}

async function mountCreateWorkoutPage() {
  workoutFormClone = createWorkoutFormTemplate.content.cloneNode(true).firstElementChild;
  exerciseFormClone = createExerciseFormTemplate.content.cloneNode(true).firstElementChild;
  workoutFormInfoTextWdiget = exerciseFormClone.querySelector('.form-info-text-workout');
  exerciseFormInfoTextWdiget = exerciseFormClone.querySelector('.form-info-text-exercise');
  submitBtn = exerciseFormClone.querySelector('.create-workout-btn');
  addExerciseBtn = exerciseFormClone.querySelector('.add-exercise-btn');
  addRestBtn = exerciseFormClone.querySelector('.add-rest-btn');

  if (appState.state.path === '/edit') {
    await setupEditView();
  }


  submitBtn.addEventListener('click', handleCreateHiit);
  addExerciseBtn.addEventListener('click', handleAddActivity);
  addRestBtn.addEventListener('click', handleAddRestActivity);
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
