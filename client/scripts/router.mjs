import { setupAccountPage } from './user-accounts-page.mjs';
import {
  setupPublicUserWorkoutPage,
  unmountPublicUserWorkoutPage,
} from './public-user-workouts-page.mjs';
import { setupExercisePage, unmountExercisePage } from './exercise-page.mjs';
import { setupCreateWorkoutPage, unmountCreateWorkoutPage } from './create-workout.mjs';
import appState from '../state.mjs';


export function mountPageRouter() {
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
      unmountPublicUserWorkoutPage();
      mountPageRouter();
      break;
    case '/account/workout/exercise':
      appState.upateState('path', '/workout');
      appState.upateState('appPath', '/account/workout');
      appState.upateState('workout', {});
      window.history.pushState(null, null, '/workout');
      unmountExercisePage();
      mountPageRouter();
      break;
    case '/account/workout/create':
      appState.upateState('path', '/workout');
      appState.upateState('appPath', '/account/workout');
      appState.upateState('workout', {});
      window.history.pushState(null, null, '/workout');
      unmountCreateWorkoutPage();
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
