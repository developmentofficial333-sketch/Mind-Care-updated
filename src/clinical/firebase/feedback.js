import { app } from "../../firebase/config";

/**
 * Feedback lives in its own subcollection rather than as an update to the
 * appointment doc itself — appointments are create-only (see
 * firestore.rules) so the original booking record stays an immutable
 * record; feedback is a separate, append-only note attached to it.
 */
export async function submitFeedback(uid, appointmentId, { rating, comment }) {
  const { getFirestore, collection, addDoc, serverTimestamp } = await import("firebase/firestore");

  const db = getFirestore(app);
  await addDoc(collection(db, "members", uid, "appointments", appointmentId, "feedback"), {
    rating,
    comment,
    createdAt: serverTimestamp(),
  });
}
