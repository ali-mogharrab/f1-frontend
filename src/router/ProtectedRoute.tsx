import { Navigate, Outlet } from "react-router";
import { LoadingMessage } from "../components/common/LoadingMessage";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return <LoadingMessage message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}