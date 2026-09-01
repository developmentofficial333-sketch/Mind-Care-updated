import { app } from "../../firebase/config";

/**
 * A provider's own view of their appointments — reads the mirror written
 * by bookAppointment() (see booking.js) at providers/{providerId}/appointments,
 * not the member-side collection, which a provider has no read access to.
 */
export async function listProviderAppointments(providerId) {
  const { getFirestore, collection, query, orderBy, getDocs } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDocs(
    query(collection(db, "providers", providerId, "appointments"), orderBy("isoDate", "asc"))
  );
  return snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }));
}

/**
 * Single appointment by id, for ProviderAppointmentPage.jsx — mirrors
 * appointments.js's getAppointment() on the member side. No rules change
 * needed: providers/{providerId}/appointments' read rule is a plain
 * request.auth.uid == providerId path check, not a resource.data check, so
 * it already works the same way for a single get() as it does for the
 * list() in listProviderAppointments above.
 */
export async function getProviderAppointment(providerId, appointmentId) {
  const { getFirestore, doc, getDoc } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDoc(doc(db, "providers", providerId, "appointments", appointmentId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

/**
 * Every appointment a provider has ever had with one specific patient — for
 * PatientHistoryPage. Filtered with `where`, sorted client-side rather than
 * via a Firestore `orderBy` — a where+orderBy on different fields needs a
 * composite index, and a single patient's appointment list is small enough
 * that sorting the returned array in JS avoids that deployment step
 * entirely.
 */
export async function listAppointmentsForPatient(providerId, memberUid) {
  const { getFirestore, collection, query, where, getDocs } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDocs(
    query(collection(db, "providers", providerId, "appointments"), where("memberUid", "==", memberUid))
  );
  return snapshot.docs
    .map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }))
    .sort((a, b) => (a.isoDate < b.isoDate ? 1 : a.isoDate > b.isoDate ? -1 : 0));
}

/**
 * Marks an appointment complete/cancelled from the provider's dashboard.
 * Both the provider-side mirror and the member's own copy need updating so
 * neither side is left showing a stale "confirmed" status — a batch (not a
 * transaction) is enough since both doc paths and the target status are
 * already known, with no read-then-write race to close.
 */
export async function updateAppointmentStatus(providerId, memberUid, appointmentId, status) {
  const { getFirestore, doc, writeBatch } = await import("firebase/firestore");

  const db = getFirestore(app);
  const batch = writeBatch(db);
  batch.update(doc(db, "providers", providerId, "appointments", appointmentId), { status });
  batch.update(doc(db, "members", memberUid, "appointments", appointmentId), { status });
  await batch.commit();
}
