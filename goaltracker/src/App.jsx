import { useMemo, useState, useEffect } from "react";
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
import NotFoundPage from "./pages/NotFoundPage";
import AppShell from "./components/layout/AppShell";

export default function App() {
  const { i18n } = useTranslation();

  const [mode, setMode] = useState("dark");
  const [showSplash, setShowSplash] = useState(true);

  const [primaryColor, setPrimaryColor] = useState(
    localStorage.getItem("primaryColor") || "blue"
  );

  useEffect(() => {
    localStorage.setItem("primaryColor", primaryColor);
  }, [primaryColor]);

  const direction = i18n.language === "fa" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  const cache = useMemo(() => {
    return createCache({
      key: direction === "rtl" ? "muirtl" : "mui",
      stylisPlugins: direction === "rtl" ? [rtlPlugin] : [],
      prepend: true,
    });
  }, [direction]);

  const theme = useMemo(
    () => getTheme(mode, direction, primaryColor),
    [mode, direction, primaryColor]
  );

  const toggleTheme = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={theme}>
      {/* GoalsProvider exposes goals state to all routes. */}
      <GoalsProvider>
        <AppShell mode={mode} toggleTheme={toggleTheme}>
          {/* Main route table for app pages. */}
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/goals" element={<GoalsListPage />} />
            <Route path="/goals/new" element={<CreateGoalPage />} />
            <Route path="/goals/:id/edit" element={<EditGoalPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route
              path="/settings"
              element={<Settings currentTheme={mode} toggleTheme={toggleTheme} />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      </GoalsProvider>
    </ThemeProvider>
  );
}