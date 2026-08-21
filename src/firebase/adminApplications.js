import { app } from "./config";

const APPLICATIONS_COLLECTION = "providerApplications";
const APPROVALS_COLLECTION = "providerApprovals";

/**
 * All "join as a provider" applications, newest first, for the admin review
 * dashboard. Only readable by admins — see isAdmin() in firestore.rules.
 */
export async function listProviderApplications() {
  const { getFirestore, collection, getDocs, orderBy, query } = await import("firebase/firestore");

  const db = getFirestore(app);
  const snapshot = await getDocs(
    query(collection(db, APPLICATIONS_COLLECTION), orderBy("createdAt", "desc"))
  );
  return snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }));
}

/**
 * Approves a provider application. Writes two things in one batch:
 *  1. The application doc itself, marked "approved" (audit trail of who
 *     reviewed it and when).
 *  2. A providerApprovals/{email} doc — the bridge that lets the applicant's
 *     OWN account self-provision a providerProfiles/{uid} record the next
 *     time they log in or register (see getOrProvisionProviderProfile in
 *     clinical/firebase/providerProfiles.js), since at application time they
 *     don't have an account/uid yet for us to write to directly.
 */
export async function approveProviderApplication(application, adminUid) {
  const { getFirestore, doc, writeBatch, serverTimestamp } = await import("firebase/firestore");

  const db = getFirestore(app);
  const batch = writeBatch(db);
  const email = application.email.toLowerCase();

  batch.update(doc(db, APPLICATIONS_COLLECTION, application.id), {
    status: "approved",
    reviewedAt: serverTimestamp(),
    reviewedBy: adminUid,
  });

  batch.set(doc(db, APPROVALS_COLLECTION, email), {
    role: "provider",
    status: "approved",
    email,
    fullName: application.fullName,
    discipline: application.discipline,
    licenseNumber: application.licenseNumber,
    yearsExperience: application.yearsExperience,
    city: application.city,
    languages: application.languages || [],
    concerns: application.concerns || [],
    feeAmount: application.feeAmount ?? null,
    applicationId: application.id,
    approvedAt: serverTimestamp(),
    approvedBy: adminUid,
  });

  await batch.commit();
}

export async function rejectProviderApplication(applicationId, adminUid) {
  const { getFirestore, doc, updateDoc, serverTimestamp } = await import("firebase/firestore");

  const db = getFirestore(app);
  await updateDoc(doc(db, APPLICATIONS_COLLECTION, applicationId), {
    status: "rejected",
    reviewedAt: serverTimestamp(),
    reviewedBy: adminUid,
  });
}

/**
 * Reverts a decision back to pending — lets an admin undo a mis-click
 * without needing direct Firebase Console access. Does not remove an
 * already-written providerApprovals doc (a provider who already
 * self-provisioned their account keeps access; re-approving later just
 * rewrites the same approval record).
 */
export async function resetProviderApplicationStatus(applicationId) {
  const { getFirestore, doc, updateDoc, deleteField } = await import("firebase/firestore");

  const db = getFirestore(app);
  await updateDoc(doc(db, APPLICATIONS_COLLECTION, applicationId), {
    status: "pending_review",
    reviewedAt: deleteField(),
    reviewedBy: deleteField(),
  });
}
