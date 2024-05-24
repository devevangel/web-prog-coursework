# About AIM

Welcome to AIM! AIM is a web application designed to empower users to create custom High-Intensity Interval Training ([HIIT](https://en.wikipedia.org/wiki/High-intensity_interval_training)) workouts. It offers the option of making your workouts public, allowing you to share your fitness journey with others, while also providing the flexibility to keep your workouts private if you prefer. AIM boasts a social media-like experience, where users can like workouts created by others, providing visibility into how many people have reacted to their public workouts.



## Robot Features

#### Create Custom Workouts
My app allows you to create your own custom workouts from scratch. Only you know your body better. Create workouts that suit your strength and stamina and watch yourself progress on my app.

#### Share/Hide Workouts
AIM allows you not only to create a workout but also to share it with other users on the app or keep it private, visible only to you.

#### Explore Workouts
Don't have an idea for a workout? No worries, my app has got you covered. You can explore workouts created by others on the app, try as many as you want, and exit the workout at any time. Once you're done, don't forget to leave a like.

#### Audio Cue (extra-feature)
AIM comes with an audio cue to inform users when their current workout activity time elapses. If you prefer to workout in silence, you can simply turn off the sound with the click of a button, and turn it back on as needed.

#### Login With Google (extra-feature)
AIM includes a hidden extra feature that allows you to login using your own user account instead of the dummy account for testing. To enable this feature, follow these steps:
1. Go to the `index.html` file and remove the comment on this code: `<!-- <button class="generic-btn login-with-google-btn">Login With Google</button> -->`
2. Go to the `accounts-page.mjs` and remove the comments on the following lines of code: `// import { handleSignInWithGoogle } from './firebase.mjs';` and `// const authBtn = document.querySelector('.login-with-google-btn'); // authBtn.addEventListener('click', handleSignInWithGoogle);`
3. Restart the app using the 'How to Use Guide'.

#### Like Users' Workouts
The app allows you to like workouts you create or workouts you see on the app that catch your attention, which helps improve overall app engagement.

## How To Use

#### Using Github

1. Clone the repository to your local machine.
2. Run `npm install` to install the necessary dependencies.
3. Run `npm start` to start the app.
4. Open `http://localhost:8080` in your web browser.
5. Create a new workout.
6. Let's get sweaty!

#### Download Zip

1. Download the zip folder.
2. Unzip the folder.
3. Open the folder in your terminal.
4. Run `npm install` to install the necessary dependencies.
5. Run `npm start` to start the app.
6. Open `http://localhost:8080` in your web browser.
7. Create a new workout.
8. Let's get really sweaty!

## What I Learned

This section of the readme contains technologies and tools I learned while building this application. Below are a few of them and how I used them:

## Audacity

I used Audacity to create the audio cue sound for my app. Audacity is a tool used by sound engineers and musicians to create and edit sounds.

## Web Browser Page Routing

Unlike the way browser routing was taught in class for a single-page web application, I developed my own based on ideas drawn from my favorite JS library, React.JS. Although there is room for improvement, I am proud of what I have accomplished so far.

## HTML Templates

After much encouragement from my tutors Rich and Matt, I decided to learn how to make use of HTML templates. This significantly improved the cleanliness and organization of my code, allowing for a better separation of concerns between JS and HTML and reducing the need for excessive createElement code in pure JS.

## Conclusion

I chose the current structure of my codebase to avoid issues of plagiarism. Many students asked me to explain the reasoning behind my coding patterns and ideas, and I often had to teach and provide practical help to them. Occasionally, some of them took a peek at my codebase to borrow a few ideas, which is why I had to be cautious and change some file names. Nonetheless, I am proud of what I have accomplished so far.


## About ChatGPT

[ChatGPT](https://arxiv.org/abs/2303.08774) was used in my application to help in writing code documentation, as well as code comments. I found this very much helpful, as it was able to save time, and most of the time, it gave near-perfect documentation and code comments.

### Here some sample prompts I used from ChatGPT 
1. help rewrite this writeup for my readme file about the app I built for my coursework
2. write me clean and concise comments for my. for functions that are exported ensure to make sue of the JavaScript JSDoc commenting style to ensure the exported function is well described.
3. js code to get current time in miiliseconds
4. rewrite this json array of objects by adding a new field into each object called workout_id with and empty string

### Note I added the prompts with the typos to show authenticity

## Refrences

#### ChatGPT

OpenAI. (2023). GPT-4 Technical Report. ArXiv:2303.08774 [Cs]. https://arxiv.org/abs/2303.08774

#### Google Fonts
Google. (2019). Google Fonts. Google Fonts. https://fonts.google.com/

#### Emoji's

Cpu Emojis | 🏿🖥⚡🖥️ | Copy & Paste. (n.d.). Emojidb.org. Retrieved April 22, 2023, from https://emojidb.org/cpu-emojis

#### Wiki HIIT
Wikipedia Contributors. (2019, March 7). High-intensity interval training. Wikipedia; Wikimedia Foundation. https://en.wikipedia.org/wiki/High-intensity_interval_training

‌

