import { app } from "../../firebase/config";

/**
 * Provider's booked times on one date — lets any signed-in member preview
 * availability before booking. Display-only; the actual no-double-booking
 * guarantee comes from the transaction in booking.js, not this read.
 */
export async function getProviderBookedTimes(providerId, isoDate) {
  const { getFirestore, collection, query, where, getDocs } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDocs(
    query(collection(db, "providers", providerId, "bookedSlots"), where("isoDate", "==", isoDate))
  );
  return snapshot.docs.map((doc) => doc.data().time);
}

/**
 * This member's own appointment times on one date, across ALL providers —
 * so the booking screen can show "you already have something then" as well
 * as "someone else has this provider then". Also display-only.
 */
export async function getMemberBookedTimes(uid, isoDate) {
  const { getFirestore, collection, query, where, getDocs } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDocs(
    query(collection(db, "members", uid, "appointments"), where("isoDate", "==", isoDate))
  );
  return snapshot.docs.map((doc) => doc.data().time);
}
