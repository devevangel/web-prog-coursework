import appState from "../state.mjs";
import { getRandomNumber, fetchData } from "./utils.mjs";

// HTML handles
const profilesListContainer = document.querySelector(
  ".profiles-list-container"
);
const APIURL = "192.168.0.16";
const profileCards = [];

// Functions
function mountAccounts(accounts) {
  accounts.map((account) => {
    const profileContainer = document.createElement("span");
    const profileImg = document.createElement("img");
    const profileDetailsContainer = document.createElement("aside");
    const namePara = document.createElement("p");
    const emailPara = document.createElement("p");
    const followersPara = document.createElement("p");
    const workoutsPara = document.createElement("p");

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
    profileContainer.classList.add("profile-card");
    profileImg.classList.add("profile-img");
    profileDetailsContainer.classList.add("profile-detials-container");
    namePara.classList.add("proile-card-text");
    emailPara.classList.add("proile-card-text");
    followersPara.classList.add("proile-card-text");
    workoutsPara.classList.add("proile-card-text");

    // Appending html to DOM
    profileDetailsContainer.appendChild(namePara);
    profileDetailsContainer.appendChild(emailPara);
    profileDetailsContainer.appendChild(followersPara);
    profileDetailsContainer.appendChild(workoutsPara);
    profileContainer.appendChild(profileImg);
    profileContainer.appendChild(profileDetailsContainer);
    profilesListContainer.appendChild(profileContainer);

    // Adding containers
    profileContainer.addEventListener("click", function (e) {
      const keys = Object.keys(account);
      for (let key of keys) {
        appState.upateState(key, account[key]);
      }
      window.location.href = "main.html";
    });
  });
}

// Network requests
const accountsData = await fetchData(`http://${APIURL}:8080/accounts`);
mountAccounts(accountsData.accounts);

// urls
// http://localhost:8080/accounts
// http://10.128.33.185:8080/accounts
