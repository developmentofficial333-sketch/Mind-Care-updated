import { app } from "../../firebase/config";

/**
 * Appointments live under members/{uid}/appointments/{appointmentId} — a
 * subcollection scoped to the owning member, rather than a top-level
 * collection filtered by a memberUid field. That makes the security rule
 * trivial and airtight (request.auth.uid == uid) instead of relying on
 * every client query being correctly constrained.
 *
 * Appointments are created via bookAppointment() in booking.js (a
 * transaction that also enforces no double-booking), not directly here.
 */
export async function getAppointment(uid, appointmentId) {
  const { getFirestore, doc, getDoc } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDoc(doc(db, "members", uid, "appointments", appointmentId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

/**
 * All of this member's appointments, past and upcoming, sorted chronologically.
 * `isoDate` is a YYYY-MM-DD string, so lexicographic ordering is chronological.
 */
export async function listAppointments(uid) {
  const { getFirestore, collection, query, orderBy, getDocs } = await import(
    "firebase/firestore"
  );

  const db = getFirestore(app);
  const snapshot = await getDocs(
    query(collection(db, "members", uid, "appointments"), orderBy("isoDate", "asc"))
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
