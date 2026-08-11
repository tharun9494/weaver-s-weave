import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAVbOGWijNUw9I8uF4XbmtVYqP-cdQKlvw",
  authDomain: "sri-varee-pattu.firebaseapp.com",
  projectId: "sri-varee-pattu",
  storageBucket: "sri-varee-pattu.firebasestorage.app",
  messagingSenderId: "846763262564",
  appId: "1:846763262564:web:d8eae345e01866c7c4d571",
  measurementId: "G-R142T2VFYE",
};

// Initialize Firebase (safeguard against multiple initializations during SSR/Vite dev hot-reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics requires a browser context (not available on server/SSR)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
