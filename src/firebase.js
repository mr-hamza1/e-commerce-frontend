import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-bUgcYJKnB_QcVq5mrJ5K2tTc4n3AA8M",
  authDomain: "e-commerce1-b961f.firebaseapp.com",
  projectId: "e-commerce1-b961f",
  storageBucket: "e-commerce1-b961f.firebasestorage.app",
  messagingSenderId: "1094300024095",
  appId: "1:1094300024095:web:f7eb93c64ec4dabf7c042a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
