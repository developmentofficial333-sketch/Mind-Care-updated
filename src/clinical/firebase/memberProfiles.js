import { app } from "../../firebase/config";

const MEMBER_PROFILES_COLLECTION = "memberProfiles";

/**
 * Identity-only profile data (name, contact, language preference). Never
 * write clinical content (needs, session notes, assessments) into this
 * collection — those belong in a separate collection with separate rules,
 * per the platform's PII/clinical data separation requirement. See
 * firestore.rules: only the signed-in owner (auth.uid === doc id) may
 * read/write their own profile.
 */
export async function createMemberProfile(uid, { fullName, email, preferredLanguage }) {
  const { getFirestore, doc, setDoc, serverTimestamp } = await import("firebase/firestore");

  const db = getFirestore(app);
  await setDoc(doc(db, MEMBER_PROFILES_COLLECTION, uid), {
    fullName,
    email,
    preferredLanguage,
    createdAt: serverTimestamp(),
  });
}

export async function getMemberProfile(uid) {
  const { getFirestore, doc, getDoc } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDoc(doc(db, MEMBER_PROFILES_COLLECTION, uid));
  return snapshot.exists() ? snapshot.data() : null;
}
