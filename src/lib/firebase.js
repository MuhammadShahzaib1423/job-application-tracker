import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Public client config — safe to ship in the bundle.
const firebaseConfig = {
  apiKey: "AIzaSyDwUJ1fcSP2l6_aDHFfUBJXLnJOKfxF_Zs",
  authDomain: "jobpilot-15028.firebaseapp.com",
  projectId: "jobpilot-15028",
  storageBucket: "jobpilot-15028.firebasestorage.app",
  messagingSenderId: "951302955166",
  appId: "1:951302955166:web:0876f70a18f542c1b6db8f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
