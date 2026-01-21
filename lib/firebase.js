// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAnalytics,
  isSupported,
  setUserProperties as _setUserProperties,
} from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDDaZT3BYmjghGiuKsCNEBhApWpiOLxuZg",
  authDomain: "atlobha-live-ec26c.firebaseapp.com",
  databaseURL: "https://atlobha-live-ec26c.firebaseio.com",
  projectId: "atlobha-live-ec26c",
  storageBucket: "atlobha-live-ec26c.appspot.com",
  messagingSenderId: "417323050523",
  appId: "1:417323050523:web:e09590b55d5ddfac89babe",
  measurementId: "G-3Q6QY93G7G",
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics (only in browser)
let analytics = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// ✅ Helper: Set user properties safely
export const setUserProperties = (properties) => {
  if (analytics && typeof window !== "undefined") {
    _setUserProperties(analytics, properties);
  }
};

// Optional: Export a getter that returns current analytics instance
// export const getAnalyticsInstance = () => {
//   return analytics;
// };

export { app, analytics };
