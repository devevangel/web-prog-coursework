import { setupAccountPage } from './accounts-page.mjs';
import {
  setupPublicUserWorkoutPage,
} from './workout-page.mjs';
import { setupExercisePage } from './exercise-page.mjs';
import { setupCreateWorkoutPage } from './create-edit-page.mjs';
import { setupExerciseListPage } from './exercise-list-page.mjs';
import appState from '../state.mjs';

const appLogo = document.querySelector('.appbar-menu-container');
const logoutBtn = document.querySelector('.logout-btn');
const userDisplayName = document.querySelector('.user-profile-name');
const userDisplayPic = document.querySelector('.user-profile-image');


/**
 * Mounts the appropriate page based on the current path state.
 */
export function mountPageRouter() {
  cleanAppUI();
  handleToggleAppNav();
  switch (appState.state.path) {
    case '/account':
      setupAccountPage();
      break;
    case '/workout':
      setupPublicUserWorkoutPage();
      break;
    case '/view':
      setupExerciseListPage();
      break;
    case '/exercise':
      setupExercisePage();
      break;
    case '/create':
      setupCreateWorkoutPage();
      break;
    case '/edit':
      setupCreateWorkoutPage();
      break;
    default:
      setupAccountPage();
      break;
  }
}

/**
 * Handles the click event of the browser's back button.
 */
export function handleBrowserBackBtnClick() {
  switch (appState.state.appPath) {
    case '/account/workout':
      appState.upateState('path', '/account');
      appState.upateState('appPath', '/account');
      window.history.pushState(null, null, '/account');
      mountPageRouter();
      break;
    case '/account/workout/view':
      appState.upateState('path', '/workout');
      appState.upateState('appPath', '/account/workout');
      window.history.pushState(null, null, '/workout');
      mountPageRouter();
      break;
    case '/account/workout/view/exercise':
      appState.upateState('path', '/view');
      appState.upateState('appPath', '/account/workout/view');
      window.history.pushState(null, null, '/view');
      mountPageRouter();
      break;
    case '/account/workout/create':
      appState.upateState('path', '/workout');
      appState.upateState('appPath', '/account/workout');
      window.history.pushState(null, null, '/workout');
      mountPageRouter();
      break;
    case '/account/workout/edit':
      appState.upateState('path', '/workout');
      appState.upateState('appPath', '/account/workout');

      window.history.pushState(null, null, '/workout');
      mountPageRouter();
      break;
    default:
      appState.upateState('path', '/account');
      appState.upateState('appPath', '/account');
      appState.upateState('user', {});
      window.history.pushState(null, null, '/account');
      mountPageRouter();
      break;
  }
}

/**
 * Loads the state of the browser URL and mounts the appropriate page.
 */
export function loadBrowserUrlState() {
  appState.upateState('path', '/account');
  appState.upateState('appPath', '/account');
  window.history.pushState(null, null, '/account');
  mountPageRouter();
}

/**
 * Toggles the visibility of the application navigation bar based on the current path state.
 */
function handleToggleAppNav() {
  const navBar = document.querySelector('.app-nav-container');
  if (appState.state.path === '/account') {
    navBar.classList.add('hide');
  } else {
    handleSetSelectUser();
    navBar.classList.remove('hide');
  }
}

/**
 * Cleans the UI by removing cloned elements and hiding pages.
 */
function cleanAppUI() {
  const clones = document.querySelectorAll('.clone');
  const pages = document.querySelectorAll('.page-container');
  pages.forEach((page) => page.classList.add('hide'));
  clones.forEach((clone) => clone.remove());
}

/**
 * Sets the display name and profile picture of the user in the UI.
 */
function handleSetSelectUser() {
  userDisplayName.textContent = appState.state.user.first_name;
  userDisplayPic.src = appState.state.user.profile_img;
}


/**
 * Navigates to the workout page.
 */
function goToWorkoutPage() {
  cleanAppUI();
  appState.upateState('path', '/workout');
  appState.upateState('appPath', '/account/workout');
  window.history.pushState(null, null, '/workout');
  mountPageRouter();
}

/**
 * Handles the logout action by resetting the path state and user data.
 */
function handleLogout() {
  appState.upateState('path', '/account');
  appState.upateState('appPath', '/account');
  appState.upateState('user', {});
  window.history.pushState(null, null, '/account');
  mountPageRouter();
}

// Event listeners
appLogo.addEventListener('click', goToWorkoutPage);
logoutBtn.addEventListener('click', handleLogout);
