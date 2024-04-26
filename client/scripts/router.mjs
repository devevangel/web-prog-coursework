import { setupAccountPage, unmountAccountPage } from './user-accounts-page.mjs';
import {
  setupPublicUserWorkoutPage,
  unmountPublicUserWorkoutPage,
} from './public-user-workouts-page.mjs';
import appState from '../state.mjs';


export function mountPageRouter() {
  unmountAccountPage();
  unmountPublicUserWorkoutPage();
  switch (appState.state.path) {
    case '/':
      setupAccountPage();
      break;
    case '/workouts':
      // setupPublicUserWorkoutPage();
      break;
    default:
      setupAccountPage();
      break;
  }
}
