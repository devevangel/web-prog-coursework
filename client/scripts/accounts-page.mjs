import { mountPageRouter } from './router.mjs';
import { handleSignInWithGoogle } from './firebase.mjs';
import appState from '../state.mjs';

const authPage = document.querySelector('.auth-page');
const authBtnTemplate = document.querySelector('#google-auth-template');

export function handleSetAccountProfile(account) {
  appState.upateState('user', account);
  appState.upateState('path', '/workout');
  appState.upateState('appPath', '/account/workout');
  window.history.pushState(null, null, '/workout');
  mountPageRouter();
}

export function mountAccountPage() {
  authPage.classList.remove('hide');
}

export function setupAccountPage() {
  mountAccountPage();
  const authBtnClone = authBtnTemplate.content.cloneNode(true).firstElementChild;
  authBtnClone.addEventListener('click', handleSignInWithGoogle);
  authPage.append(authBtnClone);
}
