import { BrowserRouter, Route, Routes } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { ArticleDetailPage } from "../pages/ArticleDetailPage";
import { ArticlesPage } from "../pages/ArticlesPage";
import { ChangePasswordPage } from "../pages/ChangePasswordPage";
import { DashboardPage } from "../pages/DashboardPage";
import { DriverDetailPage } from "../pages/DriverDetailPage";
import { DriversPage } from "../pages/DriversPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProfilePage } from "../pages/ProfilePage";
import { RaceDetailPage } from "../pages/RaceDetailPage";
import { RacesPage } from "../pages/RacesPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ResetPasswordConfirmPage } from "../pages/ResetPasswordConfirmPage";
import { StandingsPage } from "../pages/StandingsPage";
import { TeamDetailPage } from "../pages/TeamDetailPage";
import { TeamsPage } from "../pages/TeamsPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { AIAnalystPage } from "../pages/AIAnalystPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/drivers/:id" element={<DriverDetailPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/teams/:id" element={<TeamDetailPage />} />
          <Route path="/races" element={<RacesPage />} />
          <Route path="/races/:id" element={<RaceDetailPage />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password-confirm"
            element={<ResetPasswordConfirmPage />}
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/ai-analyst" element={<AIAnalystPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
