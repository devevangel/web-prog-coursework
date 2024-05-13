import { fetchData } from './utils.mjs';
import { mountPageRouter } from './router.mjs';
import appState from '../state.mjs';

const exercisePage = document.querySelector('.exercise-page');
const exerciseViewTemplate = document.querySelector('#exercise-view');
const timerSound = new Audio('./res/tick.ogg');
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
let startBtn;
let countDownInterval;
let btnControlsToHide = [];
let exerciseNameWidget;
let countDownWidget;
let circleProgressBar;
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
  if (isTimerStarted === false && isTimerPaused === false) {
    isTimerStarted = true;
    currentExercise = exerciseListCopy[0];
    currentDurationInMilli = convertDurationToMilliseconds(currentExercise.duration);
    setCurrentExerciseView();
    timerInterval = setInterval(calcTime, 1000);
    startBtn.textContent = 'Pause ⏸️';
    return;
  }

  if (isTimerStarted && isTimerPaused === false) {
    timerSound.pause();
    timerSound.currentTime = 0;
    isTimerPaused = true;
    isTimerStarted = false;
    clearInterval(timerInterval);
    startBtn.textContent = ' Start ▶️';
    return;
  }

  if (isTimerStarted === false && isTimerPaused) {
    isTimerPaused = false;
    isTimerStarted = true;
    playPausedTimer();
    setCurrentExerciseView();
    startBtn.textContent = 'Pause ⏸️';
  }
}

function calcTime() {
  timerSound.play();
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
  startBtn.textContent = ' Start ▶️';
}

function playPausedTimer() {
  timerInterval = setInterval(calcTime, 1000);
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
      timerInterval = setInterval(calcTime, 1000);
      setCurrentExerciseView();
    }
    count--;
  }, 1000);
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
  deltaPercentage = 0;
  circleProgressBar.style.setProperty('--progress', `${deltaPercentage}%`);
  startBtn.textContent = ' Start ▶️';
}

function exitWorkout() {
  appState.upateState('path', '/workout');
  appState.upateState('appPath', '/account/workout');
  window.history.pushState(null, null, '/workout');
  timerSound.pause();
  timerSound.currentTime = 0;
  unmountExercisePage();
  mountPageRouter();
}

function updateProgressBar() {
  if (deltaPercentage === 100) return;
  const deltaDuration = (totalDurationWorkedInMilli / totalDurationInMilli);
  deltaPercentage = Math.floor(deltaDuration * 100);
  circleProgressBar.style.setProperty('--progress', `${deltaPercentage}%`);
}

function clearPrevExerciseSteps() {
  const prevSteps = document.querySelectorAll('.guide-text');
  prevSteps.forEach((stepItem) => {
    stepItem.remove();
  });
}

function setCurrentExerciseView() {
  clearPrevExerciseSteps();
  exerciseNameWidget.textContent = `Activity: ${exerciseListCopy[0].title}`;
  if (exerciseListCopy[0].directions && exerciseListCopy[0].directions.length > 0) {
    exerciseGuideWidget.textContent = exerciseListCopy[0].directions;
  }
}


function mountPageView() {
  unmountExercisePage();
  exerciseViewClone = exerciseViewTemplate.content.cloneNode(true).firstElementChild;
  const workoutName = exerciseViewClone.querySelector('.workout-name-text');
  exerciseNameWidget = exerciseViewClone.querySelector('.exercise-name-text');
  startBtn = exerciseViewClone.querySelector('.workout-start-btn');
  const resetBtn = exerciseViewClone.querySelector('.workout-stop-btn');
  const exitBtn = exerciseViewClone.querySelector('.workout-exit-btn');
  btnControlsToHide = exerciseViewClone.querySelectorAll('.btn-control-hide');
  timerWidget = exerciseViewClone.querySelector('.timer-text');
  countDownContainerWidget = exerciseViewClone.querySelector('.count-down-container');
  countDownWidget = exerciseViewClone.querySelector('.next-exercise-cd');
  circleProgressBar = exerciseViewClone.querySelector('.circular-progress-bar');
  exerciseGuideWidget = exerciseViewClone.querySelector('.guide-text-container');

  startBtn.addEventListener('click', () => {
    startTimer();
  });
  resetBtn.addEventListener('click', () => {
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
