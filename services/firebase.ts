
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNk4zjWFf5LbGkmGrdCKi0HD7vKMKKk-s",
  authDomain: "restoflow-4056e.firebaseapp.com",
  projectId: "restoflow-4056e",
  storageBucket: "restoflow-4056e.firebasestorage.app",
  messagingSenderId: "32021208366",
  appId: "1:32021208366:web:2b8954f6fcdcb0877faebf",
  measurementId: "G-PGG72296WW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
