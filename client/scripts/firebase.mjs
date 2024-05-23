
/* eslint-disable import/no-unresolved */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
/* eslint-enable import/no-unresolved */
import { handleSetAccountProfile } from './accounts-page.mjs';

const firebaseConfig = {
  apiKey: 'AIzaSyAS5RidkZ2-nZgD9C3cAAhjzRa-fPVidXI',
  authDomain: 'aim-hiit.firebaseapp.com',
  projectId: 'aim-hiit',
  storageBucket: 'aim-hiit.appspot.com',
  messagingSenderId: '817124714976',
  appId: '1:817124714976:web:40cee74a208ecf0f856385',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function handleSignInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const { displayName, photoURL, uid, email } = user;
    const names = displayName.split(' ');
    const userData = {
      id: uid,
      email,
      first_name: names[0],
      last_name: names[2],
      profile_img: photoURL,
    };

    handleSetAccountProfile(userData);
  } catch (error) {
    console.log(error.message);
  }
}
