import { app, isFirebaseConfigured } from "./config";

/**
 * Thrown instead of letting a missing config reach the Firebase SDK, which
 * would otherwise fail deep inside a network call with the opaque
 * `auth/invalid-api-key`. Carries a `.code` (mirroring Firebase's own
 * AuthError shape) so callers using getAuthErrorMessage(err.code) — see
 * authErrors.js — still show something actionable instead of falling
 * through to the generic "Something went wrong" message.
 */
class FirebaseConfigError extends Error {
  constructor() {
    super(
      "Firebase is not configured: one or more VITE_FIREBASE_* environment variables are " +
        "missing. Copy .env.example to .env (or .env.local) and fill in your Firebase " +
        "project's config from the Firebase Console, then restart the dev server."
    );
    this.code = "config/firebase-not-configured";
  }
}

// firebase/auth is dynamically imported so it only loads for visitors who
// actually reach a sign-up/login flow, keeping it out of the landing page bundle.
async function getAuthInstance() {
  if (!isFirebaseConfigured) {
    throw new FirebaseConfigError();
  }
  const { getAuth } = await import("firebase/auth");
  return getAuth(app);
}

export async function signUp(email, password) {
  const { createUserWithEmailAndPassword } = await import("firebase/auth");
  return createUserWithEmailAndPassword(await getAuthInstance(), email, password);
}

export async function signIn(email, password) {
  const { signInWithEmailAndPassword } = await import("firebase/auth");
  return signInWithEmailAndPassword(await getAuthInstance(), email, password);
}

export async function logOut() {
  const { signOut } = await import("firebase/auth");
  return signOut(await getAuthInstance());
}

export async function subscribeToAuthChanges(callback) {
  const { onAuthStateChanged } = await import("firebase/auth");
  return onAuthStateChanged(await getAuthInstance(), callback);
}
