import { app } from "../../firebase/config";

const AVAILABILITY_COLLECTION = "providerAvailability";

/**
 * A provider's recurring weekly open hours — one doc per provider, keyed by
 * their own uid (1:1 with providerProfiles/{uid}). `weekly` is keyed by
 * Date.getDay() values ("0"-"6", Sun-Sat) as strings (Firestore map keys
 * are always strings); a day absent from the map means the provider
 * doesn't work that day. Each entry is a { start, end } 24h "HH:mm" range,
 * e.g. { "1": [{ start: "09:00", end: "13:00" }] } for Monday mornings.
 */
export async function getProviderAvailability(providerId) {
  const { getFirestore, doc, getDoc } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDoc(doc(db, AVAILABILITY_COLLECTION, providerId));
  return snapshot.exists() ? snapshot.data().weekly ?? null : null;
}

export async function setProviderAvailability(uid, weekly) {
  const { getFirestore, doc, setDoc, serverTimestamp } = await import("firebase/firestore");

  const db = getFirestore(app);
  await setDoc(doc(db, AVAILABILITY_COLLECTION, uid), {
    weekly,
    updatedAt: serverTimestamp(),
  });
}
