import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../ui/LoadingSpinner";

/**
 * Gates /admin routes. Distinct from ProviderRoute: being signed in isn't
 * enough — the signed-in user's admins/{uid} record (loaded by
 * AuthProvider) must exist with role === "admin". There is no self-serve
 * way to become an admin, so an unapproved user is sent back to the admin
 * login screen rather than the public site.
 */
export default function AdminRoute({ children, redirectTo = "/admin/login" }) {
  const { user, initializing, loadingAdminProfile, isAdmin } = useAuth();

  if (initializing || loadingAdminProfile) return <LoadingSpinner />;
  if (!user || !isAdmin) return <Navigate to={redirectTo} replace />;

  return children;
}
