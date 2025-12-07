
// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";

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

let app: FirebaseApp | undefined;
let analytics: Analytics | undefined;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  // Analytics might fail in some environments (e.g. strict blockers), handle gracefully
  analytics = getAnalytics(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // App continues to work with mock data even if Firebase fails
}

export { app, analytics };
