import { app } from "../../firebase/config";
import { initialsOf, formatFee } from "../utils/providerDisplay";

const PROVIDER_PROFILES_COLLECTION = "providerProfiles";

/**
 * Real, admin-verified providers — replaces the old static data/providers.js
 * placeholder now that the application → admin approval → providerProfiles
 * pipeline (see adminApplications.js / providerProfiles.js) actually
 * produces real records. Only role:"provider", status:"approved" profiles
 * are ever returned; firestore.rules enforces the same restriction
 * server-side so this can't be bypassed by a modified client.
 */
function normalizeProvider(uid, data) {
  return {
    id: uid,
    name: data.fullName,
    initials: initialsOf(data.fullName),
    credentials: data.discipline,
    discipline: data.discipline,
    concerns: data.concerns || [],
    languages: data.languages || [],
    location: data.city,
    feeAmount: data.feeAmount ?? null,
    fee: formatFee(data.feeAmount),
  };
}

export async function listApprovedProviders() {
  const { getFirestore, collection, query, where, getDocs } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDocs(
    query(
      collection(db, PROVIDER_PROFILES_COLLECTION),
      where("role", "==", "provider"),
      where("status", "==", "approved")
    )
  );
  return snapshot.docs.map((docSnapshot) => normalizeProvider(docSnapshot.id, docSnapshot.data()));
}

/** Single approved provider by uid — used by pages that only need one (booking flow). */
export async function getApprovedProvider(uid) {
  const { getFirestore, doc, getDoc } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDoc(doc(db, PROVIDER_PROFILES_COLLECTION, uid));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  if (data.role !== "provider" || data.status !== "approved") return null;

  return normalizeProvider(snapshot.id, data);
}
