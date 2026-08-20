import { app } from "../../firebase/config";

const PROVIDER_PROFILES_COLLECTION = "providerProfiles";

/**
 * Provider identity/access record — keyed by the provider's auth uid, kept
 * separate from memberProfiles since it's a different account shape
 * (role, approval status) rather than more member fields. Expected shape:
 * { role: "provider", status: "approved" | "pending" | ... }.
 *
 * There is no self-serve provider signup or admin-approval flow yet — this
 * collection is written manually (e.g. via the Firebase console) until one
 * exists. See providerApplications in firebase/firestore.js for the
 * separate (and not yet connected to this) "apply to join" lead queue.
 */
export async function getProviderProfile(uid) {
  const { getFirestore, doc, getDoc } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDoc(doc(db, PROVIDER_PROFILES_COLLECTION, uid));
  return snapshot.exists() ? snapshot.data() : null;
}
