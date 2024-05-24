import { mountPageRouter } from './router.mjs';
// import { handleSignInWithGoogle } from './firebase.mjs';
import appState from '../state.mjs';

const authPage = document.querySelector('.auth-page');

export function handleSetAccountProfile(account) {
  appState.upateState('user', account);
  appState.upateState('path', '/workout');
  appState.upateState('appPath', '/account/workout');
  window.history.pushState(null, null, '/workout');
  mountPageRouter();
}

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

export function mountAccountPage() {
  authPage.classList.remove('hide');
}

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
  // const loginWithGoogleBtn = document.querySelector('.login-with-google-btn');
  // loginWithGoogleBtn.addEventListener('click', handleSignInWithGoogle);
  tryNowBtns.forEach((btn) => {
    btn.addEventListener('click', handleQuickLogin);
  });
}
