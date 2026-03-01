import { useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route, Navigate } from "react-router-dom";

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
  const [mode, setMode] = useState("dark");

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <GoalsProvider>
        <AppShell mode={mode} toggleTheme={toggleTheme}>
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
