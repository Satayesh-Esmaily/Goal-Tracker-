import { Box, Grid, Stack, useTheme } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ActiveGoalsSection from "../../components/dashboard/ActiveGoalsSection";
import CompletedGoalsCard from "../../components/dashboard/CompletedGoalsCard";
import CompletionInsightCard from "../../components/dashboard/CompletionInsightCard";
import DashboardHero from "../../components/dashboard/DashboardHero";
import DashboardStatsGrid from "../../components/dashboard/DashboardStatsGrid";
import LiveDateTimeCard from "../../components/dashboard/LiveDateTimeCard";
import RecentActivityCard from "../../components/dashboard/RecentActivityCard";
import { useAuth } from "../../context/AuthContext";
import { useGoals } from "../../context/GoalsContext";

export default function DashboardPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const { goals, stats, addProgress, togglePause, deleteGoal } = useGoals();
  const { user } = useAuth();
  const [goalToDelete, setGoalToDelete] = useState(null);

  const visibleGoals = goals.filter((goal) => goal.status !== "deleted");
  const activeGoals = visibleGoals.filter((goal) => goal.status !== "completed");
  const completedGoals = visibleGoals.filter((goal) => goal.status === "completed").slice(0, 5);

  const recentLogs = visibleGoals
    .flatMap((goal) =>
      (goal.logs || []).map((log, index) => ({
        id: `${goal.id}-${log.date}-${index}`,
        title: goal.title,
        amount: log.amount,
        date: new Date(log.date),
      }))
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  const percent = Math.max(0, Math.min(100, stats.completionRate));

  return (
    <Box sx={{ minHeight: "calc(100vh - 72px)", py: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          px: { xs: 0.5, sm: 1.5, md: 2.5 },
        }}
      >
        <Stack sx={{ width: "100%", maxWidth: "1920px" }} spacing={2.5}>
          <DashboardHero
            totalGoals={visibleGoals.length}
            completedCount={stats.completedCount}
            streak={stats.streak}
            isFa={isFa}
            isDark={isDark}
            userName={user?.name}
          />

          <DashboardStatsGrid stats={stats} />

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <ActiveGoalsSection
                goals={activeGoals}
                onAddProgress={addProgress}
                onTogglePause={togglePause}
                onDelete={setGoalToDelete}
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={2.5}>
                <LiveDateTimeCard />
                <CompletionInsightCard
                  completedCount={stats.completedCount}
                  totalGoals={visibleGoals.length}
                  percent={percent}
                />
                <RecentActivityCard recentLogs={recentLogs} />
                <CompletedGoalsCard goals={completedGoals} />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Box>

      <ConfirmDialog
        open={Boolean(goalToDelete)}
        title={`⚠️ ${t("settings.confirmTitle")}`}
        description={goalToDelete ? `${t("goalCard.delete")} "${goalToDelete.title}"?` : ""}
        confirmLabel={t("goalCard.delete")}
        onCancel={() => setGoalToDelete(null)}
        onConfirm={() => {
          if (!goalToDelete) return;
          deleteGoal(goalToDelete.id);
          setGoalToDelete(null);
        }}
      />
    </Box>
  );
}
