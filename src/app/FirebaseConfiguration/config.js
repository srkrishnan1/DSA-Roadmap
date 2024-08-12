// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSWzyrvFhSRPGUg5_AWNTEISp8qh3ZZ5w",
  authDomain: "dsaroadmap-30dd3.firebaseapp.com",
  projectId: "dsaroadmap-30dd3",
  storageBucket: "dsaroadmap-30dd3.appspot.com",
  messagingSenderId: "958664546645",
  appId: "1:958664546645:web:8337a7d779693a086c77dc",
  measurementId: "G-PJP2KS3NL5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const GoogleProvider = new GoogleAuthProvider();
export const GitHubProvider = new GithubAuthProvider();
