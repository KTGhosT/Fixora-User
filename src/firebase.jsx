// src/firebase.jsx
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

// Your Firebase web config
const firebaseConfig = {
    apiKey: "AIzaSyBGuM_Vr0Nogz9j1vOi6Qn5RI-RrjRLpUs",
    authDomain: "fixora-a0e6a.firebaseapp.com",
    projectId: "fixora-a0e6a",
    storageBucket: "fixora-a0e6a.firebasestorage.app",
    messagingSenderId: "272840245949",
    appId: "1:272840245949:web:8340ab0c87f4312cd62dd4",
    measurementId: "G-2X63QVX7H0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// For development, add test phone numbers in Firebase Console → Authentication → Phone

export { auth, RecaptchaVerifier };
