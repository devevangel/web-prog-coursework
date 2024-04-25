import { setupAccountPage, unmountAccountPage } from './user-accounts-page.mjs';
import { setupuserWorkoutPage, unmountuserWorkoutPage } from './user-workouts-page.mjs';
import appState from '../state.mjs';


export function mountPageRouter() {
  unmountAccountPage();
  unmountuserWorkoutPage();
  switch (appState.state.path) {
    case '/':
      setupAccountPage();
      break;
    case '/workouts':
      setupuserWorkoutPage();
      break;

    default:
      setupAccountPage();
      break;
  }
}
