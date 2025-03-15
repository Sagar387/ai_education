// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7AiN1iNdHXm4jNGK-ZhUUyW0COGx8riY",
  authDomain: "ai-education-2531a.firebaseapp.com",
  projectId: "ai-education-2531a",
  storageBucket: "ai-education-2531a.firebasestorage.app",
  messagingSenderId: "245295845948",
  appId: "1:245295845948:web:7c53b54fee3cfa76eee939",
  measurementId: "G-QW8Y2X6W2K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export{app,auth};