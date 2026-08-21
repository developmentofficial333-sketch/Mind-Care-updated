import { getAdminProfile } from "./adminAccess";
import { getOrProvisionProviderProfile } from "../clinical/firebase/providerProfiles";

/**
 * Where to send someone immediately after they sign in or register — shared
 * by ClinicalLoginPage and RegisterPage so "log in, land on the right
 * dashboard" behaves identically everywhere instead of each page
 * reimplementing its own role check. Checked directly here (rather than
 * waiting on AuthProvider's own async role fetches) so the very first
 * redirect after auth is correct, not one render late.
 *
 * Priority: admin > approved provider > member. An account is rarely more
 * than one of these in practice, but if it is, admin tooling takes
 * precedence since that's the more privileged surface.
 */
export async function resolvePostAuthPath(uid, email) {
  const adminProfile = await getAdminProfile(uid).catch(() => null);
  if (adminProfile?.role === "admin") return "/admin";

  const providerProfile = await getOrProvisionProviderProfile(uid, email).catch(() => null);
  if (providerProfile?.role === "provider" && providerProfile?.status === "approved") {
    return "/provider/dashboard";
  }

  return "/dashboard";
}
