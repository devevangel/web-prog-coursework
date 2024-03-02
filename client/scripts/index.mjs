import appState from "../state.mjs";
import { getRandomNumber } from "./utils.mjs";

// HTML handles
const profilesListContainer = document.querySelector(
  ".profiles-list-container"
);
const themeBtn = document.querySelector("#theme-btn");

// Functions
async function getAccounts(url) {
  const res = await fetch(url);
  const data = res.json();
  return data;
}

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
    workoutsPara.textContent = `${getRandomNumber(8, 10)}`;

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
  });
}

function changeTheme(e) {
  if (e.target.textContent === "☀️") {
    themeBtn.textContent = "🌑";
  } else {
    themeBtn.textContent = "☀️";
  }
}

// Event listeners
themeBtn.addEventListener("click", changeTheme);

const accountsData = await getAccounts(`http://localhost:8080/accounts`);
mountAccounts(accountsData.accounts);
