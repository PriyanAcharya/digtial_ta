// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpktOQ1HFoPg2YphQUHxTFurkNShNsTdo",
  authDomain: "digitalta-e1a7e.firebaseapp.com",
  projectId: "digitalta-e1a7e",
  storageBucket: "digitalta-e1a7e.firebasestorage.app",
  messagingSenderId: "1032029935779",
  appId: "1:1032029935779:web:9fc3ca98905b0907c94716",
  measurementId: "G-87MHJHC0SB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();