import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../ui/LoadingSpinner";

/**
 * Gates provider-only routes (e.g. /provider/dashboard). Distinct from
 * ProtectedRoute: being signed in isn't enough here — the signed-in user's
 * providerProfiles/{uid} record (loaded by AuthProvider) must also have
 * role === "provider" and status === "approved".
 */
export default function ProviderRoute({ children, redirectTo = "/app/login" }) {
  const { user, initializing, loadingProviderProfile, isApprovedProvider } = useAuth();

  if (initializing || loadingProviderProfile) return <LoadingSpinner />;
  if (!user) return <Navigate to={redirectTo} replace />;
  if (!isApprovedProvider) return <Navigate to="/" replace />;

  return children;
}
