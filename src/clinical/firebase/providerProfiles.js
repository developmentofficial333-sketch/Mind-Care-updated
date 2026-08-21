import { app } from "../../firebase/config";

const PROVIDER_PROFILES_COLLECTION = "providerProfiles";
const APPROVALS_COLLECTION = "providerApprovals";

/**
 * Provider identity/access record — keyed by the provider's auth uid, kept
 * separate from memberProfiles since it's a different account shape
 * (role, approval status) rather than more member fields. Expected shape:
 * { role: "provider", status: "approved" | "pending" | ... }.
 */
export async function getProviderProfile(uid) {
  const { getFirestore, doc, getDoc } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDoc(doc(db, PROVIDER_PROFILES_COLLECTION, uid));
  return snapshot.exists() ? snapshot.data() : null;
}

/**
 * Reads this user's providerProfiles record if one already exists — or, if
 * an admin has approved a providerApplications submission for this same
 * email (see adminApplications.js), self-provisions one on the spot and
 * returns it. This is what lets someone go from "approved by an admin" to
 * "sees the provider dashboard" on their very next login, with no manual
 * uid lookup by the admin — the application is submitted before an account
 * exists, so there's no uid to write to until the applicant signs in.
 *
 * Firestore rules only allow this self-write when a matching
 * providerApprovals/{email} doc exists (admin-written only), so a user can
 * never grant themselves provider access this way.
 */
export async function getOrProvisionProviderProfile(uid, email) {
  const existing = await getProviderProfile(uid);
  if (existing) return existing;
  if (!email) return null;

  const { getFirestore, doc, getDoc, setDoc, serverTimestamp } = await import("firebase/firestore");
  const db = getFirestore(app);

  const approvalSnapshot = await getDoc(doc(db, APPROVALS_COLLECTION, email.toLowerCase()));
  if (!approvalSnapshot.exists()) return null;

  const approval = approvalSnapshot.data();
  if (approval.status !== "approved") return null;

  const profile = {
    role: "provider",
    status: "approved",
    fullName: approval.fullName,
    discipline: approval.discipline,
    licenseNumber: approval.licenseNumber,
    yearsExperience: approval.yearsExperience,
    city: approval.city,
    languages: approval.languages || [],
    concerns: approval.concerns || [],
    feeAmount: approval.feeAmount ?? null,
    email: approval.email,
    provisionedAt: serverTimestamp(),
  };
  await setDoc(doc(db, PROVIDER_PROFILES_COLLECTION, uid), profile);
  return profile;
}
