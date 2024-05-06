import { fetchData } from './utils.mjs';
import { mountPageRouter } from './router.mjs';
import appState from '../state.mjs';

const exercisePage = document.querySelector('.exercise-page');
const exerciseViewTemplate = document.querySelector('#exercise-view');
let exerciseViewClone;
let totalDurationInMilli = 0;
let totalDurationWorkedInMilli = 0;
let exerciseList = [];
let exerciseListCopy = [];
let currentExercise = {};
let currentDurationInMilli = 0;
let timerInterval;
let isTimerStarted = false;
let isTimerPaused = false;
let timerWidget;
let countDownContainerWidget;
let countDownInterval;
let btnControlsToHide = [];
let exerciseNameWidget;
let countDownWidget;
let progessBarWidget;
let exerciseGuideWidget;
let deltaPercentage = 0;


async function getAllExercisesForWorkout() {
  const result = await fetchData(`http://localhost:8080/exercises/${appState.state.workout.id}`);
  return result.exercises;
}

function convertDurationToMilliseconds(duration) {
  const totalMilliSeconds = duration * 60000;
  return totalMilliSeconds;
}

function startTimer() {
  if (isTimerStarted === false) {
    isTimerStarted = true;
    currentExercise = exerciseListCopy[0];
    currentDurationInMilli = convertDurationToMilliseconds(currentExercise.duration);
    setCurrentExerciseView();
    timerInterval = setInterval(calcTime, 100);
    return;
  }

  if (isTimerPaused === true) {
    isTimerPaused = false;
    playPausedTimer();
    setCurrentExerciseView();
  }
}

function calcTime() {
  const time = new Date(currentDurationInMilli);
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  timerWidget.textContent = `${minutes}:${seconds}`;

  if (currentDurationInMilli <= 0) {
    moveToNextExercise();
  }
  currentDurationInMilli = currentDurationInMilli - 1000;
  totalDurationWorkedInMilli = totalDurationWorkedInMilli + 1000;
  updateProgressBar();
}

function moveToNextExercise() {
  clearInterval(timerInterval);
  exerciseListCopy.shift();
  currentExercise = exerciseListCopy[0];
  if (currentExercise && currentExercise.duration) {
    displayWaitTimerToNextExercise();
  } else {
    handleUserFinishWorkout();
    resetTimer();
  }
}

function handleUserFinishWorkout() {
  exerciseNameWidget.textContent = 'Hurray workout complete!';
  clearPrevExerciseSteps();
  resetTimer();
}

function playPausedTimer() {
  timerInterval = setInterval(calcTime, 100);
}

function displayWaitTimerToNextExercise() {
  clearPrevExerciseSteps();
  exerciseNameWidget.textContent = '';
  timerWidget.classList.add('hide');
  btnControlsToHide.forEach((btn) => {
    btn.classList.add('hide');
  });
  countDownContainerWidget.classList.remove('hide');
  let count = 4;
  countDownInterval = setInterval(() => {
    countDownWidget.textContent = count;
    if (count < 0) {
      clearInterval(countDownInterval);
      countDownWidget.textContent = 5;
      countDownContainerWidget.classList.add('hide');
      timerWidget.classList.remove('hide');
      btnControlsToHide.forEach((btn) => {
        btn.classList.remove('hide');
      });
      currentDurationInMilli = convertDurationToMilliseconds(currentExercise.duration);
      timerInterval = setInterval(calcTime, 100);
      setCurrentExerciseView();
    }
    count--;
  }, 1000);
}

function pauseTimer() {
  isTimerPaused = true;
  clearInterval(timerInterval);
}

function resetTimer() {
  clearInterval(timerInterval);
  exerciseListCopy = [...exerciseList];
  currentExercise = {};
  currentDurationInMilli = 0;
  totalDurationWorkedInMilli = 0;
  isTimerPaused = false;
  isTimerStarted = false;
  timerWidget.textContent = '00:00';
}

function exitWorkout() {
  appState.upateState('path', '/workout');
  appState.upateState('appPath', '/account/workout');
  window.history.pushState(null, null, '/workout');
  unmountExercisePage();
  mountPageRouter();
}

function updateProgressBar() {
  if (deltaPercentage === 100) return;
  const deltaDuration = (totalDurationWorkedInMilli / totalDurationInMilli);
  deltaPercentage = Math.floor(deltaDuration * 100);
  progessBarWidget.style.width = `${deltaPercentage}%`;
}

function clearPrevExerciseSteps() {
  const prevSteps = document.querySelectorAll('.guide-text');
  prevSteps.forEach((stepItem) => {
    stepItem.remove();
  });
}

function setCurrentExerciseView() {
  clearPrevExerciseSteps();
  exerciseNameWidget.textContent = `Current Activity: ${exerciseListCopy[0].title}`;
  if (exerciseListCopy[0].directions && exerciseListCopy[0].directions.length > 0) {
    exerciseListCopy[0].directions.forEach((step) => {
      const stepListItem = document.createElement('li');
      stepListItem.classList.add('guide-text');
      stepListItem.textContent = step;
      exerciseGuideWidget.append(stepListItem);
    });
  }
}


function mountPageView() {
  unmountExercisePage();
  exerciseViewClone = exerciseViewTemplate.content.cloneNode(true).firstElementChild;
  const workoutName = exerciseViewClone.querySelector('.workout-name-text');
  exerciseNameWidget = exerciseViewClone.querySelector('.exercise-name-text');
  const startBtn = exerciseViewClone.querySelector('.workout-start-btn');
  const pauseBtn = exerciseViewClone.querySelector('.workout-pause-btn');
  const resetBtn = exerciseViewClone.querySelector('.workout-stop-btn');
  const exitBtn = exerciseViewClone.querySelector('.workout-exit-btn');
  btnControlsToHide = exerciseViewClone.querySelectorAll('.btn-control-hide');
  timerWidget = exerciseViewClone.querySelector('.timer-text');
  countDownContainerWidget = exerciseViewClone.querySelector('.count-down-container');
  countDownWidget = exerciseViewClone.querySelector('.next-exercise-cd');
  progessBarWidget = exerciseViewClone.querySelector('.progess-bar-sub');
  exerciseGuideWidget = exerciseViewClone.querySelector('.guide-text-container');

  startBtn.addEventListener('click', () => {
    deltaPercentage = 0;
    progessBarWidget.style.width = `${deltaPercentage}%`;
    startTimer();
  });
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', () => {
    deltaPercentage = 0;
    progessBarWidget.style.width = `${deltaPercentage}%`;
    resetTimer();
  });
  exitBtn.addEventListener('click', exitWorkout);

  workoutName.textContent = appState.state.workout.title;
  exercisePage.append(exerciseViewClone);
  setCurrentExerciseView();
  exercisePage.classList.remove('hide');
}

export function unmountExercisePage() {
  clearInterval(timerInterval);
  clearInterval(countDownInterval);
  exercisePage.classList.add('hide');
  if (exerciseViewClone) {
    exerciseViewClone.remove();
    exercisePage.innerHTML = '';
  }

  if (isTimerPaused || isTimerStarted) {
    resetTimer();
  }
}

export function mountExercisePage() {
  exercisePage.classList.remove('hide');
}


export async function setupExercisePage() {
  exerciseList = await getAllExercisesForWorkout();
  exerciseListCopy = [...exerciseList];
  totalDurationInMilli = convertDurationToMilliseconds(appState.state.workout.duration);
  mountPageView();
  mountExercisePage();
}
