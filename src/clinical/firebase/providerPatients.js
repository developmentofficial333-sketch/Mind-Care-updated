import { app } from "../../firebase/config";

/**
 * Relationship marker, one doc per patient a provider has actually booked
 * with — written by bookAppointment()'s transaction (booking.js), not here.
 * Two jobs: powers the Patients roster directly (no scanning every
 * appointment to derive "distinct patients"), and is what firestore.rules
 * checks before letting a provider read that patient's memberNeeds.
 */
export async function listProviderPatients(providerId) {
  const { getFirestore, collection, getDocs } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDocs(collection(db, "providerPatients", providerId, "patients"));
  return snapshot.docs
    .map((docSnapshot) => ({ memberUid: docSnapshot.id, ...docSnapshot.data() }))
    .sort((a, b) => (a.lastBookedAt?.seconds ?? 0) < (b.lastBookedAt?.seconds ?? 0) ? 1 : -1);
}
