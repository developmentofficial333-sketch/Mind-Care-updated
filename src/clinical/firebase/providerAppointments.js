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
