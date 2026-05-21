import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { ArticleDetailPage } from "../pages/ArticleDetailPage";
import { ArticlesPage } from "../pages/ArticlesPage";
import { DashboardPage } from "../pages/DashboardPage";
import { DriversPage } from "../pages/DriversPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProfilePage } from "../pages/ProfilePage";
import { RacesPage } from "../pages/RacesPage";
import { RegisterPage } from "../pages/RegisterPage";
import { StandingsPage } from "../pages/StandingsPage";
import { TeamsPage } from "../pages/TeamsPage";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/races" element={<RacesPage />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}