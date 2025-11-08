import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBpktOQ1HFoPg2YphQUHxTFurkNShNsTdo",
  authDomain: "digitalta-e1a7e.firebaseapp.com",
  projectId: "digitalta-e1a7e",
  storageBucket: "digitalta-e1a7e.firebasestorage.app",
  messagingSenderId: "1032029935779",
  appId: "1:1032029935779:web:9fc3ca98905b0907c94716",
  measurementId: "G-87MHJHC0SB",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); // <-- instance
