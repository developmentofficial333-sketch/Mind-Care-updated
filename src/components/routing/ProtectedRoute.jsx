import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function ProtectedRoute({ children, redirectTo = "/app/login" }) {
  const { user, initializing } = useAuth();

  if (initializing) return <LoadingSpinner />;
  if (!user) return <Navigate to={redirectTo} replace />;

  return children;
}
