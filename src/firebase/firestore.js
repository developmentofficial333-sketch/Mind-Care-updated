import { app } from "./config";

const NEWSLETTER_COLLECTION = "newsletterSubscribers";

/**
 * Adds an email to the newsletter list, keyed by the email itself so
 * Firestore rules can allow `create` only and reject a second write to the
 * same document — that gives free duplicate protection without ever
 * granting read/list access to the collection (which would otherwise expose
 * every subscriber's email to any client).
 *
 * Returns "added" | "duplicate".
 *
 * firebase/firestore is dynamically imported so its ~200kB stays out of the
 * initial page bundle and only loads when someone actually submits the form.
 */
export async function subscribeToNewsletter(email) {
  const { getFirestore, doc, setDoc, serverTimestamp } = await import("firebase/firestore");

  const db = getFirestore(app);
  const ref = doc(db, NEWSLETTER_COLLECTION, email.toLowerCase());

  try {
    await setDoc(ref, { email: email.toLowerCase(), createdAt: serverTimestamp() });
    return "added";
  } catch (err) {
    if (err.code === "permission-denied") {
      // Rules only allow `create`; a write to an existing doc id is denied.
      return "duplicate";
    }
    throw err;
  }
}
