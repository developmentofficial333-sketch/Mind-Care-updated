const MESSAGES = {
  "auth/invalid-email": "Enter a valid email address.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with that email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error — check your connection and try again.",
  // These two both mean the same underlying problem: the app's Firebase
  // project credentials are missing or wrong. "config/firebase-not-configured"
  // is thrown proactively by getAuthInstance() (see firebase/auth.js) before
  // ever reaching the network; "auth/invalid-api-key" is what the Firebase
  // SDK itself throws if a garbage (but non-empty) key slips through.
  "config/firebase-not-configured":
    "This app isn't connected to Firebase yet. Copy .env.example to .env, add your Firebase project's config, and restart the dev server.",
  "auth/invalid-api-key":
    "This app isn't connected to Firebase yet. Check the Firebase config in .env and restart the dev server.",
};

export function getAuthErrorMessage(code) {
  return MESSAGES[code] || "Something went wrong. Please try again.";
}
