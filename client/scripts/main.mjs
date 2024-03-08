import appState from "../state.mjs";
import { fetchData } from "./utils.mjs";

// HTML handles
const links = document.querySelectorAll(".in-page-tab");
const userFeedsContainer = document.querySelector(".user-feeds-container");

// Functions
function handleClickedTab(e) {
  const textContent = e.target.textContent;
  for (let link of links) {
    if (link.textContent === textContent) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
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
    const descHeader = document.createElement("span");
    const targetAreasPara = document.createElement("p");
    const targetAreasHeader = document.createElement("span");
    const durationPara = document.createElement("p");
    const durationHeader = document.createElement("span");
    const levelPara = document.createElement("p");
    const levelHeader = document.createElement("span");
    const authorPara = document.createElement("p");
    const authorHeader = document.createElement("span");

    // Adding class names
    cardSpan.classList.add("user-feed-card");
    cardHeaderSpan.classList.add("user-feed-header");
    feedTitle.classList.add("feed-card-text-content");
    userProfileImg.classList.add("user-feed-card-profile-img");
    feedImg.classList.add("feed-card-img");
    cardContentHolder.classList.add("feed-card-content-container");
    descPara.classList.add("feed-card-text-content");
    descHeader.classList.add("sub-title");
    targetAreasPara.classList.add("feed-card-text-content");
    targetAreasHeader.classList.add("sub-title");
    durationPara.classList.add("feed-card-text-content");
    durationHeader.classList.add("sub-title");
    levelPara.classList.add("feed-card-text-content");
    levelHeader.classList.add("sub-title");
    authorPara.classList.add("feed-card-text-content");
    authorHeader.classList.add("sub-title");

    // Adding attributes
    userProfileImg.src = feed.owner.profile_img;
    userProfileImg.alt = `${feed.owner.first_name}-${feed.owner.last_name}`;
    feedImg.src = feed.url;
    feedImg.alt = feed.title;

    // adding content
    feedTitle.textContent = feed.title;
    descHeader.textContent = "About: ";
    descPara.textContent = feed.description;
    targetAreasHeader.textContent = "Target-Areas: ";
    targetAreasPara.textContent = feed.targeted_areas.toString();
    durationHeader.textContent = "Duration: ";
    durationPara.textContent = feed.duration;
    levelHeader.textContent = "Level: ";
    levelPara.textContent = feed.level;
    authorHeader.textContent = "Author: ";
    authorPara.textContent = `${feed.owner.first_name} ${feed.owner.last_name}`;

    // Appending html elements
    cardHeaderSpan.appendChild(feedTitle);
    cardHeaderSpan.appendChild(userProfileImg);
    descPara.appendChild(descHeader);
    targetAreasPara.appendChild(targetAreasHeader);
    durationPara.appendChild(durationHeader);
    levelPara.appendChild(levelHeader);
    authorPara.appendChild(authorHeader);
    cardContentHolder.appendChild(descPara);
    cardContentHolder.appendChild(targetAreasPara);
    cardContentHolder.appendChild(durationPara);
    cardContentHolder.appendChild(levelPara);
    cardContentHolder.appendChild(authorPara);
    cardHeaderSpan.appendChild(feedTitle);
    cardHeaderSpan.appendChild(userProfileImg);

    cardSpan.appendChild(cardHeaderSpan);
    cardSpan.appendChild(feedImg);
    cardSpan.appendChild(cardContentHolder);

    // Rendering html
    userFeedsContainer.appendChild(cardSpan);
  });
}

for (let link of links) {
  link.addEventListener("click", handleClickedTab);
}

// Network requests
const userFeeds = await fetchData(`http://10.128.33.185:8080/workouts`);
mountFeeds(userFeeds.feeds);
console.log(appState);

//urls
// http://10.128.33.185:8080/workouts
// http://localhost:8080/workouts
