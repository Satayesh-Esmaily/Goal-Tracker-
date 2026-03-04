import { useMemo, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getTheme } from "./theme/theme";
import DashboardPage from "./pages/dashboard/DashboardPage";
import CreateGoalPage from "./pages/goal/CreateGoalPage";
import EditGoalPage from "./pages/goal/EditGoalPage";
import Settings from "./pages/setting/Settings";
import { GoalsProvider } from "./context/GoalsContext";
import GoalsListPage from "./pages/goal/GoalsListPage";
import CategoriesPage from "./pages/goal/CategoriesPage";
import ArchivePage from "./pages/goal/ArchivePage";
import NotFoundPage from "./pages/NotFoundPage";
import AppShell from "./components/layout/AppShell";
import SplashScreen from "./components/common/SplashScreen";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

import { ThemeProviderCustom, useTheme } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProviderCustom>
      <AppInner />
    </ThemeProviderCustom>
  );
}

function AppInner() {
  const { mode, toggleMode, primaryColor, setPrimaryColor } = useTheme();
  const { i18n } = useTranslation();

  const [showSplash, setShowSplash] = useState(true);

  const direction = i18n.language === "fa" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  const theme = useMemo(
    () => getTheme(mode, direction, primaryColor),
    [mode, direction, primaryColor]
  );

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <GoalsProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <AppShell mode={mode} toggleTheme={toggleMode}>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/dashboard" element={<Navigate to="/" replace />} />
                      <Route path="/goals" element={<GoalsListPage />} />
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
        </GoalsProvider>
      </AuthProvider>

      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
    </ThemeProvider>
  );
}
