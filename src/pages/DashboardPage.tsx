import { Navigate } from "react-router-dom";
import { LoadingMessage } from "../components/common/LoadingMessage";
import { PageHeader } from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";

export function DashboardPage() {
  const { user, isAuthenticated, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return <LoadingMessage message="Loading dashboard..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section>
      <PageHeader
        eyebrow="Account"
        title="Dashboard"
        description="This page is only visible after login."
      />

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">
          Welcome, {user?.full_name || user?.username}
        </h2>

        <div className="mt-4 space-y-2 text-slate-600">
          <p>
            <span className="font-semibold text-slate-900">Username:</span>{" "}
            {user?.username}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Email:</span>{" "}
            {user?.email}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Country:</span>{" "}
            {user?.profile?.country || "Not set"}
          </p>
        </div>
      </div>
    </section>
  );
}