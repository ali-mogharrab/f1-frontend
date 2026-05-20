import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { ArticleDetailPage } from "../pages/ArticleDetailPage";
import { ArticlesPage } from "../pages/ArticlesPage";
import { DriversPage } from "../pages/DriversPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { RacesPage } from "../pages/RacesPage";
import { StandingsPage } from "../pages/StandingsPage";
import { TeamsPage } from "../pages/TeamsPage";
import { DashboardPage } from "../pages/DashboardPage";

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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}