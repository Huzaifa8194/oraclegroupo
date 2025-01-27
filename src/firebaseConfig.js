import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

const firebaseConfig = {
  apiKey: "AIzaSyASPYbZCflNxI6fIX65S0EESPn-gDzGm0w",
  authDomain: "oracle-site-b2304.firebaseapp.com",
  projectId: "oracle-site-b2304",
  storageBucket: "oracle-site-b2304.firebasestorage.app",
  messagingSenderId: "472083279663",
  appId: "1:472083279663:web:a446d6e2838d11a7ecfbda",
  measurementId: "G-35Q9Z55FHY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Initialize Firebase Authentication

// Initialize Analytics only on the client side
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics, db, storage, auth }; // Export auth
