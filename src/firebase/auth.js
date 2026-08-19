import { app } from "./config";

// firebase/auth is dynamically imported so it only loads for visitors who
// actually reach a sign-up/login flow, keeping it out of the landing page bundle.
async function getAuthInstance() {
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
