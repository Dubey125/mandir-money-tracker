// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";   // Firestore import
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHuduM8P-haW9N8PUV5emmTZV_6zRLCwU",
  authDomain: "mandir-donation-e5dd1.firebaseapp.com",
  projectId: "mandir-donation-e5dd1",
  storageBucket: "mandir-donation-e5dd1.appspot.com", // ✅ यहां typo fix किया
  messagingSenderId: "59297406542",
  appId: "1:59297406542:web:c4d4d542abf4136dc2ed1f",
  measurementId: "G-FCH7RYG90R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// (optional) Analytics
const analytics = getAnalytics(app);

export { db };
