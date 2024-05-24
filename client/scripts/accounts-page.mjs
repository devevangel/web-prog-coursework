import { mountPageRouter } from './router.mjs';
// import { handleSignInWithGoogle } from './firebase.mjs';
import appState from '../state.mjs';

const authPage = document.querySelector('.auth-page');

/**
 * Updates the user account profile and navigates to the workout page.
 * @param {Object} account - The user account data.
 */
export function handleSetAccountProfile(account) {
  appState.upateState('user', account);
  appState.upateState('path', '/workout');
  appState.upateState('appPath', '/account/workout');
  window.history.pushState(null, null, '/workout');
  mountPageRouter();
}

/**
 * Handles quick login with predefined user data.
 */
function handleQuickLogin() {
  const userData = {
    id: 'btz0wMw70ZNhDMw6qkMxEPWTGhg1',
    email: 'dev.evangel@gmail.com',
    first_name: 'Evangel',
    last_name: 'Boakes',
    profile_img: 'https://robohash.org/dfgsgd',
  };

  handleSetAccountProfile(userData);
}

/**
 * Mounts the account page.
 */
export function mountAccountPage() {
  authPage.classList.remove('hide');
}

/**
 * Sets up the account page, checks if user is logged in, otherwise displays the account page and adds event listeners for quick login.
 */
export function setupAccountPage() {
  if (appState.state.user.id) {
    appState.upateState('path', '/workout');
    appState.upateState('appPath', '/account/workout');
    window.history.pushState(null, null, '/workout');
    mountPageRouter();
    return;
  }

  mountAccountPage();
  const tryNowBtns = document.querySelectorAll('.try-now-btn');
  tryNowBtns.forEach((btn) => {
    btn.addEventListener('click', handleQuickLogin);
  });
}
