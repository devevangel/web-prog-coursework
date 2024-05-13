import { fetchData, getRandomNumber } from './utils.mjs';
import { mountPageRouter } from './router.mjs';
import appState from '../state.mjs';

const usersAccountsPage = document.querySelector('.user-accounts');
const pageHeading = document.createElement('p');
const pageContent = document.createElement('section');
const accountCardTemplate = document.querySelector('#account-card-template');
const profileCards = [];


async function getAccountsData() {
  const data = await fetchData('http://localhost:8080/accounts');
  return data.accounts;
}

function mountPageView() {
  pageHeading.classList.add('heading-text');
  pageContent.classList.add('profiles-list-container');
  pageHeading.textContent = 'Select a user account profile';
  usersAccountsPage.appendChild(pageHeading);
  usersAccountsPage.appendChild(pageContent);
}

function handleAccountProfileClick(account) {
  appState.upateState('user', account);
  appState.upateState('path', '/workout');
  appState.upateState('appPath', '/account/workout');
  window.history.pushState(null, null, '/workout');
  unmountAccountPage();
  mountPageRouter();
}


function mountAccountListView(accounts) {
  accounts.forEach(account => {
    const acctCardClone = accountCardTemplate.content.cloneNode(true).firstElementChild;
    const acctImg = acctCardClone.querySelector('.profile-img');
    const name = acctCardClone.querySelector('.acct-name');
    const email = acctCardClone.querySelector('.acct-email');
    const followers = acctCardClone.querySelector('.acct-followers');
    const workouts = acctCardClone.querySelector('.acct-workout');
    const selectAccountBtn = acctCardClone.querySelector('.select-account-btn');
    // Settling html content
    acctImg.src = account.profile_img;
    acctImg.alt = `${account.first_name} ${account.last_name}`;
    name.textContent = `Name: ${account.first_name} ${account.last_name}`;
    email.textContent = `Email: ${account.email}`;
    followers.textContent = `Followers: ${getRandomNumber(1, 5)} K`;
    workouts.textContent = `Total Workouts: ${getRandomNumber(8, 10)}`;

    // Add event listeners
    selectAccountBtn.addEventListener('click', () => {
      handleAccountProfileClick(account);
    });

    // Appending html to DOM
    pageContent.appendChild(acctCardClone);
    profileCards.push(acctCardClone);
  });
}

function unmountAccountPage() {
  usersAccountsPage.classList.add('hide');
  profileCards.forEach(card => {
    card.removeEventListener('click', handleAccountProfileClick);
    card.remove();
  });
}

export function mountAccountPage() {
  usersAccountsPage.classList.remove('hide');
}

export async function setupAccountPage() {
  const accounts = await getAccountsData();
  mountPageView();
  mountAccountListView(accounts);
  mountAccountPage();
}
