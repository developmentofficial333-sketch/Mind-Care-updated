import { app } from "../../firebase/config";

const NOTES_COLLECTION = "consultationNotes";

/**
 * A provider's free-text note on one appointment, visible read-only to the
 * member it belongs to (see firestore.rules — the rule, not this function,
 * is what actually decides who's allowed to read a given note). Doc id
 * reuses the appointment's own id.
 */
export async function getConsultationNote(appointmentId) {
  const { getFirestore, doc, getDoc } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDoc(doc(db, NOTES_COLLECTION, appointmentId));
  return snapshot.exists() ? snapshot.data() : null;
}

/**
 * Firestore evaluates this as `create` the first time (doc doesn't exist
 * yet) and `update` on every edit after — the split create/update rules in
 * firestore.rules apply correctly either way with no branching needed here.
 */
export async function saveConsultationNote(providerId, memberUid, appointmentId, note) {
  const { getFirestore, doc, setDoc, serverTimestamp } = await import("firebase/firestore");

  const db = getFirestore(app);
  await setDoc(
    doc(db, NOTES_COLLECTION, appointmentId),
    { providerId, memberUid, note, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
