import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CreateGoalPage from "../pages/create goal/CreateGoalPage";
import EditGoalPage from "../pages/create goal/EditGoalPage";
import Settings from "../pages/setting/Settings";
import GoalsListPage from "../pages/goal/GoalsListPage";
import GoalDetailsPage from "../pages/goal/GoalDetailsPage";
import CategoriesPage from "../pages/category/CategoriesPage";
import ArchivePage from "../pages/archive/ArchivePage";
import NotFoundPage from "../pages/not found/NotFoundPage";
import LoginPage from "../pages/auth/LoginPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AppShell from "../components/layout/AppShell";

export default function AppRoutes({
  mode,
  toggleMode,
  primaryColor,
  setPrimaryColor,
}) {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <AppShell mode={mode} toggleTheme={toggleMode}>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route
                  path="/dashboard"
                  element={<Navigate to="/" replace />}
                />
                <Route path="/goals" element={<GoalsListPage />} />
                <Route path="/goals/:id" element={<GoalDetailsPage />} />
                <Route path="/archive" element={<ArchivePage />} />
                <Route path="/goals/new" element={<CreateGoalPage />} />
                <Route path="/goals/:id/edit" element={<EditGoalPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route
                  path="/settings"
                  element={
                    <Settings
                      currentTheme={mode}
                      toggleTheme={toggleMode}
                      primaryColor={primaryColor}
                      setPrimaryColor={setPrimaryColor}
                    />
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
