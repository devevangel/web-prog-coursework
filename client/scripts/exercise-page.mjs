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
let prevExerciseTextWidget;
let nextExerciseTextWidget;
let isMute = false;

/**
 * Retrieves all exercises associated with the current workout.
 * @returns {Promise<Array>} - A promise that resolves to an array of exercise objects.
 */
async function getAllExercisesForWorkout() {
  const result = await fetchData(`http://localhost:8000/exercises/${appState.state.workout.id}`);
  return result.exercises;
}

/**
 * Converts duration from minutes to milliseconds.
 * @param {number} duration - Duration in minutes.
 * @returns {number} - Duration in milliseconds.
 */
function convertDurationToMilliseconds(duration) {
  const totalMilliSeconds = duration * 60000;
  return totalMilliSeconds;
}

/**
 * Starts or pauses the workout timer.
 */
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

  if (exerciseListCopy[1]) {
    nextExerciseTextWidget.textContent = exerciseListCopy[1].title;
  }

  if (currentDurationInMilli <= 0) {
    moveToNextExercise();
  }
  currentDurationInMilli = currentDurationInMilli - 1000;
  totalDurationWorkedInMilli = totalDurationWorkedInMilli + 1000;
  updateProgressBar();
}

/**
 * Moves to the next exercise in the workout.
 */
function moveToNextExercise() {
  clearInterval(timerInterval);
  prevExerciseTextWidget.textContent = exerciseListCopy[0].title;
  exerciseListCopy.shift();
  currentExercise = exerciseListCopy[0];
  if (currentExercise && currentExercise.duration) {
    displayWaitTimerToNextExercise();
  } else {
    handleUserFinishWorkout();
    resetTimer();
  }
}

/**
 * Handles actions when the workout is completed.
 */
function handleUserFinishWorkout() {
  exerciseNameWidget.textContent = 'Hurray workout complete!';
  clearPrevExerciseSteps();
  resetTimer();
  startBtn.textContent = ' Start ▶️';
  exerciseGuideWidget.textContent = '';
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

/**
 * Resets the workout timer and related variables.
 */
function resetTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  if (countDownInterval) {
    clearInterval(countDownInterval);
  }
  exerciseListCopy = [...exerciseList];
  currentExercise = {};
  currentDurationInMilli = 0;
  totalDurationWorkedInMilli = 0;
  isTimerPaused = false;
  isTimerStarted = false;
  timerWidget.textContent = '00:00';
  deltaPercentage = 0;
  circleProgressBar.style.setProperty('--progress', '0%');
  startBtn.textContent = ' Start ▶️';
  prevExerciseTextWidget.textContent = '';
  nextExerciseTextWidget.textContent = '';
}

/**
 * Exits the workout and navigates back to the workouts page.
 */
function exitWorkout() {
  appState.upateState('path', '/view');
  appState.upateState('appPath', '/account/workout/view');
  window.history.pushState(null, null, '/view');
  resetTimer();
  mountPageRouter();
}

/**
 * Updates the progress bar based on the elapsed time.
 */
function updateProgressBar() {
  if (deltaPercentage === 100) return;
  const deltaDuration = (totalDurationWorkedInMilli / totalDurationInMilli);
  deltaPercentage = Math.floor(deltaDuration * 100);
  circleProgressBar.style.setProperty('--progress', `${deltaPercentage}%`);
}

/**
 * Clears the previous exercise steps.
 */
function clearPrevExerciseSteps() {
  const prevSteps = document.querySelectorAll('.guide-text');
  prevSteps.forEach((stepItem) => {
    stepItem.remove();
  });
}

/**
 * Sets the view for the current exercise.
 */
function setCurrentExerciseView() {
  clearPrevExerciseSteps();
  exerciseNameWidget.textContent = `Ongoing Activity: ${currentExercise.title}`;
  if (exerciseListCopy[0].directions && exerciseListCopy[0].directions.length > 0) {
    exerciseGuideWidget.textContent = exerciseListCopy[0].directions;
  }
}

/**
 * Handles muting/unmuting the timer sound.
 * @param {HTMLElement} btnWidget - The mute/unmute button element.
 */
function handleMute(btnWidget) {
  if (isMute) {
    isMute = false;
    btnWidget.textContent = 'Mute 🔊';
    timerSound.muted = false;
  } else {
    btnWidget.textContent = 'Unmute 🔇';
    timerSound.muted = true;
    isMute = true;
  }
}


/**
 * Mounts the exercise page view.
 */
function mountPageView() {
  exerciseViewClone = exerciseViewTemplate.content.cloneNode(true).firstElementChild;
  const workoutName = exerciseViewClone.querySelector('.workout-name-text');
  exerciseNameWidget = exerciseViewClone.querySelector('.exercise-name-text');
  startBtn = exerciseViewClone.querySelector('.workout-start-btn');
  const resetBtn = exerciseViewClone.querySelector('.workout-stop-btn');
  const exitBtn = exerciseViewClone.querySelector('.workout-exit-btn');
  const muteBtn = exerciseViewClone.querySelector('.workout-mute-btn');
  btnControlsToHide = exerciseViewClone.querySelectorAll('.btn-control-hide');
  timerWidget = exerciseViewClone.querySelector('.timer-text');
  countDownContainerWidget = exerciseViewClone.querySelector('.count-down-container');
  countDownWidget = exerciseViewClone.querySelector('.next-exercise-cd');
  circleProgressBar = exerciseViewClone.querySelector('.circular-progress-bar');
  exerciseGuideWidget = exerciseViewClone.querySelector('.guide-text-container');
  prevExerciseTextWidget = exerciseViewClone.querySelector('.prev-exercise-text');
  nextExerciseTextWidget = exerciseViewClone.querySelector('.next-exercise-text');

  startBtn.addEventListener('click', () => {
    startTimer();
  });
  resetBtn.addEventListener('click', () => {
    resetTimer();
  });
  exitBtn.addEventListener('click', exitWorkout);
  muteBtn.addEventListener('click', () => {
    handleMute(muteBtn);
  });

  workoutName.textContent = appState.state.workout.title;
  exercisePage.append(exerciseViewClone);
  if (exerciseListCopy[1]) {
    nextExerciseTextWidget.textContent = exerciseListCopy[1].title;
  }
  setCurrentExerciseView();
  exercisePage.classList.remove('hide');
}

/**
 * Mounts the exercise page.
 */
export function mountExercisePage() {
  exercisePage.classList.remove('hide');
}

/**
 * Sets up the exercise page, including fetching exercises and mounting the page view.
 */
export async function setupExercisePage() {
  exerciseList = await getAllExercisesForWorkout();
  exerciseListCopy = [...exerciseList];
  totalDurationInMilli = convertDurationToMilliseconds(appState.state.workout.duration);
  mountPageView();
  mountExercisePage();
}
