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
    address: data.address ?? null,
    feeAmount: data.feeAmount ?? null,
    fee: formatFee(data.feeAmount),
  };
}

// Safety cap, not a real pagination limit — at national scale this list
// could grow past what's reasonable to fetch in one query. 300 covers any
// realistic near-term provider count; true cursor-based pagination is the
// right fix once the directory grows past that, not raising this number.
const MAX_PROVIDERS = 300;

// DashboardPage, CarePage, and ClinicalQuizPage each call this independently
// on mount, so navigating between them in one session would otherwise
// re-read the whole directory from Firestore every time for data that
// virtually never changes moment-to-moment. A short in-memory cache (module
// state, not persisted) collapses those into one real read per TTL window —
// cuts both Firestore read costs and load latency on every page but the
// first. Cleared on full page reload, which is fine: a stale 60s-old list
// during one session is a non-issue for a provider directory.
const CACHE_TTL_MS = 60_000;
let cachedProviders = null;
let cachedAt = 0;

export async function listApprovedProviders() {
  if (cachedProviders && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedProviders;
  }

  const { getFirestore, collection, query, where, limit, getDocs } = await import(
    "firebase/firestore"
  );

  const db = getFirestore(app);
  const snapshot = await getDocs(
    query(
      collection(db, PROVIDER_PROFILES_COLLECTION),
      where("role", "==", "provider"),
      where("status", "==", "approved"),
      limit(MAX_PROVIDERS)
    )
  );
  cachedProviders = snapshot.docs.map((docSnapshot) =>
    normalizeProvider(docSnapshot.id, docSnapshot.data())
  );
  cachedAt = Date.now();
  return cachedProviders;
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
