import appState from "../state.mjs";
import { fetchData } from "./utils.mjs";

// HTML handles
const links = document.querySelectorAll(".in-page-tab");
const userFeedsContainer = document.querySelector(".user-feeds-container");
const appProfileImg = document.querySelector("#user-app-bar-profile-img");

const APIURL = "localhost";

// Functions
function clearFeeds() {
  while (userFeedsContainer.firstChild) {
    userFeedsContainer.removeChild(userFeedsContainer.firstChild);
  }
}

async function handleClickedTab(e) {
  const textContent = e.target.textContent;
  for (let link of links) {
    if (link.textContent === textContent) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  }

  switch (textContent) {
    case "Explore":
      const exploreFeeds = await fetchData(`http://${APIURL}:8080/workouts`);
      clearFeeds();
      mountFeeds(exploreFeeds.feeds);
      break;
    case "Your Workouts":
      const yourWorkoutFeeds = await fetchData(
        `http://${APIURL}:8080/workouts/me/${appState.state.id}`
      );
      clearFeeds();
      mountFeeds(yourWorkoutFeeds.feeds);
      break;

    default:
      break;
  }
}

function mountFeeds(feeds) {
  feeds.map((feed) => {
    // Creating all html elements
    const cardSpan = document.createElement("span");
    const cardHeaderSpan = document.createElement("span");
    const feedTitle = document.createElement("h4");
    const userProfileImg = document.createElement("img");
    const feedImg = document.createElement("img");
    const cardContentHolder = document.createElement("aside");
    const descPara = document.createElement("p");
    const targetAreasPara = document.createElement("p");
    const durationPara = document.createElement("p");
    const levelPara = document.createElement("p");
    const authorPara = document.createElement("p");
    const likesPara = document.createElement("p");

    // Adding class names
    cardSpan.classList.add("user-feed-card");
    cardHeaderSpan.classList.add("user-feed-header");
    feedTitle.classList.add("feed-card-text-content");
    userProfileImg.classList.add("user-feed-card-profile-img");
    feedImg.classList.add("feed-card-img");
    cardContentHolder.classList.add("feed-card-content-container");
    descPara.classList.add("feed-card-text-content");
    targetAreasPara.classList.add("feed-card-text-content");
    durationPara.classList.add("feed-card-text-content");
    levelPara.classList.add("feed-card-text-content");
    authorPara.classList.add("feed-card-text-content");
    likesPara.classList.add("feed-card-text-content");

    // Adding attributes
    userProfileImg.src = feed.owner.profile_img;
    userProfileImg.alt = `${feed.owner.first_name}-${feed.owner.last_name}`;
    feedImg.src = feed.url;
    feedImg.alt = feed.title;

    // adding content
    feedTitle.textContent = feed.title;
    targetAreasPara.textContent = feed.targeted_areas.toString();
    durationPara.textContent = feed.duration;
    levelPara.textContent = feed.level;
    authorPara.textContent = `${feed.owner.first_name} ${feed.owner.last_name}`;

    // Appending html elements
    cardHeaderSpan.appendChild(feedTitle);
    cardHeaderSpan.appendChild(userProfileImg);
    descPara.innerHTML = ` <span class='sub-title'>About: </span>${feed.description}`;
    targetAreasPara.innerHTML = `<span class='sub-title'>Target-Areas: </span>${feed.targeted_areas.toString()}`;
    durationPara.innerHTML = `<span class='sub-title'>Duration: </span>${feed.duration} mins`;
    levelPara.innerHTML = `<span class='sub-title'>Level: </span>${feed.level}`;
    authorPara.innerHTML = `<span class='sub-title'>Author: </span>${feed.owner.first_name} ${feed.owner.last_name}`;
    likesPara.innerHTML = `<span class='sub-title'>Likes: </span>${feed.likes.length}`;

    cardContentHolder.appendChild(descPara);
    cardContentHolder.appendChild(targetAreasPara);
    cardContentHolder.appendChild(durationPara);
    cardContentHolder.appendChild(levelPara);
    cardContentHolder.appendChild(authorPara);
    cardContentHolder.appendChild(likesPara);
    cardHeaderSpan.appendChild(feedTitle);
    cardHeaderSpan.appendChild(userProfileImg);

    cardSpan.appendChild(cardHeaderSpan);
    cardSpan.appendChild(feedImg);
    cardSpan.appendChild(cardContentHolder);

    // Rendering html
    userFeedsContainer.appendChild(cardSpan);
  });
}

// main
for (let link of links) {
  link.addEventListener("click", handleClickedTab);
}
appProfileImg.src = appState.state.profile_img;

// Network requests
const userFeeds = await fetchData(`http://${APIURL}:8080/workouts`);
clearFeeds();
mountFeeds(userFeeds.feeds);
console.log(appState.state);

//urls
// http://10.128.33.185:8080/workouts
// http://localhost:8080/workouts
