import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDnLchyoLb8_y6hNjzC2vvq3NfO9LxX6us",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pizzeria-giovanni.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pizzeria-giovanni",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pizzeria-giovanni.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "517704576954",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:517704576954:web:a129743b3f43b3027ef783",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
