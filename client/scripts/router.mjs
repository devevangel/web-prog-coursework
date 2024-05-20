import { setupAccountPage } from './accounts-page.mjs';
import {
  setupPublicUserWorkoutPage,
} from './workout-page.mjs';
import { setupExercisePage } from './exercise-page.mjs';
import { setupCreateWorkoutPage } from './create-edit-page.mjs';
import appState from '../state.mjs';

const appLogo = document.querySelector('.appbar-menu-container');
const logoutBtn = document.querySelector('.logout-btn');
const userDisplayName = document.querySelector('.user-profile-name');
const userDisplayPic = document.querySelector('.user-profile-image');


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

export function loadBrowserUrlState() {
  appState.upateState('path', '/account');
  appState.upateState('appPath', '/account');
  appState.upateState('user', {});
  window.history.pushState(null, null, '/account');
  mountPageRouter();
}

export function handleBrowserBackBtnClick() {
  switch (appState.state.appPath) {
    case '/account/workout':
      appState.upateState('path', '/account');
      appState.upateState('appPath', '/account');
      appState.upateState('user', {});
      window.history.pushState(null, null, '/account');
      mountPageRouter();
      break;
    case '/account/workout/exercise':
      appState.upateState('path', '/workout');
      appState.upateState('appPath', '/account/workout');
      appState.upateState('workout', {});
      window.history.pushState(null, null, '/workout');
      mountPageRouter();
      break;
    case '/account/workout/create':
      appState.upateState('path', '/workout');
      appState.upateState('appPath', '/account/workout');
      appState.upateState('workout', {});
      window.history.pushState(null, null, '/workout');
      mountPageRouter();
      break;
    case '/account/workout/edit':
      appState.upateState('path', '/workout');
      appState.upateState('appPath', '/account/workout');
      appState.upateState('workout', {});
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

function handleToggleAppNav() {
  const navBar = document.querySelector('.app-nav-container');
  if (appState.state.path === '/account') {
    navBar.classList.add('hide');
  } else {
    handleSetSelectUser();
    navBar.classList.remove('hide');
  }
}

function cleanAppUI() {
  const clones = document.querySelectorAll('.clone');
  const pages = document.querySelectorAll('.page-container');
  pages.forEach((page) => page.classList.add('hide'));
  clones.forEach((clone) => clone.remove());
}

function handleSetSelectUser() {
  userDisplayName.textContent = appState.state.user.first_name;
  userDisplayPic.src = appState.state.user.profile_img;
}


function goToWorkoutPage() {
  cleanAppUI();
  appState.upateState('path', '/workout');
  appState.upateState('appPath', '/account/workout');
  window.history.pushState(null, null, '/workout');
  mountPageRouter();
}

function handleLogout() {
  appState.upateState('path', '/account');
  appState.upateState('appPath', '/account');
  appState.upateState('user', {});
  window.history.pushState(null, null, '/account');
  mountPageRouter();
}


appLogo.addEventListener('click', goToWorkoutPage);
logoutBtn.addEventListener('click', handleLogout);
