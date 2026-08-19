import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children, redirectTo = "/app/login" }) {
  const { user, initializing } = useAuth();

  if (initializing) return null;
  if (!user) return <Navigate to={redirectTo} replace />;

  return children;
}
