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

const DEMO_REQUEST_COLLECTION = "demoRequests";

/**
 * Saves a "Request a demo" form submission (RequestDemoPage.jsx). Unlike the
 * newsletter form, repeat submissions are expected (a lead can inquire more
 * than once), so this is a plain create-only write with no id-based
 * duplicate check.
 */
export async function submitDemoRequest(formData) {
  const { getFirestore, collection, addDoc, serverTimestamp } = await import("firebase/firestore");

  const db = getFirestore(app);
  await addDoc(collection(db, DEMO_REQUEST_COLLECTION), {
    ...formData,
    createdAt: serverTimestamp(),
  });
}

const PROVIDER_APPLICATION_COLLECTION = "providerApplications";

/**
 * Saves a "Join as a provider" application (ProviderApplicationPage.jsx).
 * This is intentionally NOT a self-serve signup — providers must be
 * credential-verified by MindCare's team before they can offer care (per
 * the platform's clinical safety requirements), so this just queues the
 * application for manual review, same create-only pattern as demo requests.
 */
export async function submitProviderApplication(formData) {
  const { getFirestore, collection, addDoc, serverTimestamp } = await import("firebase/firestore");

  const db = getFirestore(app);
  await addDoc(collection(db, PROVIDER_APPLICATION_COLLECTION), {
    ...formData,
    status: "pending_review",
    createdAt: serverTimestamp(),
  });
}
