import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8hCT8XTOgjtt0biNvHSBC299MDcR06Pc",
  authDomain: "goal-tracker-eb869.firebaseapp.com",
  projectId: "goal-tracker-eb869",
  storageBucket: "goal-tracker-eb869.firebasestorage.app",
  messagingSenderId: "175147781045",
  appId: "1:175147781045:web:b297e00a1465a54698a7fc",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
