import { fetchData, getRandomNumber } from './utils.mjs';
import { mountPageRouter } from './router.mjs';
import appState from '../state.mjs';

const usersAccountsPage = document.querySelector('.user-accounts');
const pageHeading = document.createElement('p');
const pageContent = document.createElement('section');
const profileListViews = [];


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
  appState.upateState('path', '/workouts');
  mountPageRouter();
}


function mountAccountListView(accounts) {
  accounts.forEach(account => {
    // Creating elements
    const profileContainer = document.createElement('span');
    const profileImg = document.createElement('img');
    const profileDetailsContainer = document.createElement('aside');
    const namePara = document.createElement('p');
    const emailPara = document.createElement('p');
    const followersPara = document.createElement('p');
    const workoutsPara = document.createElement('p');


    // Settling html content
    profileImg.src = account.profile_img;
    profileImg.alt = `${account.first_name} ${account.last_name}`;
    namePara.textContent = `Name: ${account.first_name} ${account.last_name}`;
    emailPara.textContent = `Email: ${account.email}`;
    followersPara.textContent = `Followers: ${getRandomNumber(1, 5)} K`;
    workoutsPara.textContent = `Total Workouts: ${getRandomNumber(8, 10)}`;

    // Adding unique id's
    profileContainer.id = account.id;

    // Adding css class names
    profileContainer.classList.add('profile-card');
    profileImg.classList.add('profile-img');
    profileDetailsContainer.classList.add('profile-detials-container');
    namePara.classList.add('proile-card-text');
    emailPara.classList.add('proile-card-text');
    followersPara.classList.add('proile-card-text');
    workoutsPara.classList.add('proile-card-text');

    // Add event listeners
    profileContainer.addEventListener('click', () => {
      handleAccountProfileClick(account);
    });

    // Appending html to DOM
    profileDetailsContainer.append(namePara, emailPara, followersPara, workoutsPara);
    profileContainer.append(profileImg, profileDetailsContainer);
    pageContent.appendChild(profileContainer);

    profileListViews.push(profileContainer);
  });
}

export function unmountAccountPage() {
  usersAccountsPage.classList.add('hide');
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
