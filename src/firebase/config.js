import { initializeApp, getApps, getApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// True only once every required field is a real, non-empty string — lets
// callers that actually need auth/Firestore (as opposed to just rendering
// the page) fail with a clear message instead of a cryptic SDK error like
// `auth/invalid-api-key`.
export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === "string" && value.length > 0
);

// Avoid re-initializing during Vite HMR.
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
