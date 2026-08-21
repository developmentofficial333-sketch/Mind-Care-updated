import { app } from "./config";

const ADMINS_COLLECTION = "admins";

/**
 * Admin identity record — keyed by the admin's auth uid. There is no
 * self-serve way to become an admin: this collection is only ever written
 * by hand in the Firebase Console (see firestore.rules, which blocks all
 * client writes to it). Expected shape: { role: "admin", name: "..." }.
 */
export async function getAdminProfile(uid) {
  const { getFirestore, doc, getDoc } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDoc(doc(db, ADMINS_COLLECTION, uid));
  return snapshot.exists() ? snapshot.data() : null;
}
