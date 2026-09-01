import { app } from "../../firebase/config";

const MEMBER_NEEDS_COLLECTION = "memberNeeds";

/**
 * Self-reported reasons-for-visiting (onboarding). Kept in a separate
 * collection from memberProfiles.js — this is the start of the clinical
 * side of the data model, so it gets its own security rules and, later, its
 * own care team access controls, distinct from plain identity data.
 */
export async function saveMemberNeeds(uid, selectedNeeds) {
  const { getFirestore, doc, setDoc, serverTimestamp } = await import("firebase/firestore");

  const db = getFirestore(app);
  await setDoc(
    doc(db, MEMBER_NEEDS_COLLECTION, uid),
    { needs: selectedNeeds, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

/**
 * Read by the member themselves, or by a provider who actually has a
 * booking relationship with them (see firestore.rules' providerPatients
 * check) — used by PatientHistoryPage.jsx.
 */
export async function getMemberNeeds(uid) {
  const { getFirestore, doc, getDoc } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDoc(doc(db, MEMBER_NEEDS_COLLECTION, uid));
  return snapshot.exists() ? snapshot.data() : null;
}
