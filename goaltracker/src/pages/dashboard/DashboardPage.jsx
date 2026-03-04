import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import FlagCircleOutlinedIcon from "@mui/icons-material/FlagCircleOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import GoalCard from "../../components/dashboard/GoalCard";
import LiveDateTimeCard from "../../components/dashboard/LiveDateTimeCard";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useGoals } from "../../context/GoalsContext";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";

function SectionCard({ title, action, children, sx }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
        ...sx,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {(title || action) && (
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={800}>
              {title}
            </Typography>
            {action}
          </Stack>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

function MetricCard({ title, value, icon, color, subtitle }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: isDark
          ? "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(15,23,42,0.82))"
          : "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(248,250,252,0.95))",
        boxShadow: isDark ? "0 8px 22px rgba(2,6,23,0.35)" : "0 6px 20px rgba(15,23,42,0.06)",
      }}
    >
      <Box sx={{ position: "absolute", insetInlineStart: 0, top: 0, width: "100%", height: 3, bgcolor: color }} />
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, lineHeight: 1.1 }}>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: `${color}20`,
              color,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { goals, stats, addProgress, togglePause, deleteGoal } = useGoals();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const [goalToDelete, setGoalToDelete] = useState(null);

  const visibleGoals = goals.filter((goal) => goal.status !== "deleted");
  // Split goals for dashboard sections.
  const activeGoals = visibleGoals.filter((goal) => goal.status !== "completed");
  const completedGoals = visibleGoals.filter((goal) => goal.status === "completed").slice(0, 5);
  // Build a short "recent activity" list from all goal logs.
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

  // Keep completion rate in a valid progress-bar range.
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
          {/* Hero section with greeting and quick actions. */}
          <SectionCard
            sx={{
              background: isDark
                ? "linear-gradient(120deg, rgba(25,118,210,0.32), rgba(15,23,42,0.88))"
                : "linear-gradient(120deg, rgba(25,118,210,0.14), rgba(255,255,255,1))",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
            >
              <Box>
                {user?.name && (
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 0.45,
                      color: isDark ? "rgba(191,219,254,0.92)" : "rgba(30,64,175,0.86)",
                      fontWeight: 700,
                    }}
                  >
                    Welcome, {user.name}
                  </Typography>
                )}
                <Typography variant="h4" fontWeight={800}>
                  {t("dashboard.title")}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                  {t("dashboard.subtitle")}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} useFlexGap flexWrap="wrap">
                  {/* Small chips summarize key counts at a glance. */}
                    <Chip
                    size="small"
                    label={t("dashboard.totalGoals", { count: visibleGoals.length })}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 700,
                      bgcolor: "rgba(30,64,175,0.48)",
                      color: "#dbeafe",
                      border: "1px solid rgba(96,165,250,0.72)",
                    }}
                  />
                  <Chip
                    size="small"
                    label={t("dashboard.completedChip", { count: stats.completedCount })}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 700,
                      bgcolor: "rgba(22,101,52,0.5)",
                      color: "#bbf7d0",
                      border: "1px solid rgba(34,197,94,0.78)",
                    }}
                  />
                  <Chip
                    size="small"
                    label={t("dashboard.streakChip", { count: stats.streak })}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 700,
                      bgcolor: "rgba(146,64,14,0.52)",
                      color: "#fde68a",
                      border: "1px solid rgba(245,158,11,0.82)",
                    }}
                  />
                </Stack>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={isFa ? 2.75 : 1.25}>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/goals/new"
                  startIcon={<AddRoundedIcon />}
                  sx={{ px: isFa ? 2.75 : 2 }}
                >
                  {t("dashboard.newGoal")}
                </Button>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/goals"
                  endIcon={<ArrowOutwardRoundedIcon />}
                  sx={{ px: isFa ? 2.75 : 2 }}
                >
                  {t("dashboard.manageGoals")}
                </Button>
              </Stack>
            </Stack>
          </SectionCard>

          <Grid container spacing={2}>
            {/* Quick summary metrics */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <MetricCard
                title={t("dashboard.activeGoals")}
                value={stats.activeCount}
                subtitle={t("dashboard.currentlyInProgress")}
                color="#1976d2"
                icon={<FlagCircleOutlinedIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <MetricCard
                title={t("dashboard.completed")}
                value={stats.completedCount}
                subtitle={t("dashboard.finishedTargets")}
                color="#2e7d32"
                icon={<CheckCircleOutlineRoundedIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <MetricCard
                title={t("dashboard.currentStreak")}
                value={`${stats.streak}d`}
                subtitle={t("dashboard.consecutiveDays")}
                color="#ed6c02"
                icon={<LocalFireDepartmentOutlinedIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <MetricCard
                title={t("dashboard.totalXP")}
                value={stats.xpTotal}
                subtitle={t("dashboard.progressPoints")}
                color="#9c27b0"
                icon={<WorkspacePremiumOutlinedIcon fontSize="small" />}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2.5}>
            {/* Main list of current goals */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <SectionCard
                title={t("dashboard.activeGoals")}
                action={<Chip size="small" label={t("dashboard.itemsCount", { count: activeGoals.length })} />}
              >
                {activeGoals.length === 0 ? (
                  <Typography color="text.secondary">{t("dashboard.noActiveGoals")}</Typography>
                ) : (
                  <Grid container spacing={1.75}>
                    {/* Show only a compact preview of active goals on dashboard. */}
                    {activeGoals.slice(0, 6).map((goal) => (
                      <Grid size={{ xs: 12, md: 6 }} key={goal.id} sx={{ display: "flex" }}>
                        <GoalCard
                          goal={goal}
                          onAddProgress={() => addProgress(goal.id, 1)}
                          onTogglePause={() => togglePause(goal.id)}
                          onEdit={() => navigate(`/goals/${goal.id}/edit`)}
                          onDelete={() => setGoalToDelete(goal)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </SectionCard>
            </Grid>

            {/* Right side insights and activity */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={2.5}>
                <LiveDateTimeCard />

                <SectionCard title={t("dashboard.completionInsight")}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <CircularProgress variant="determinate" value={percent} size={92} thickness={4.8} />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          position: "absolute",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="h6" fontWeight={800}>
                          {percent}%
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t("dashboard.completedFrom", { completed: stats.completedCount, total: visibleGoals.length })}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={percent}
                        sx={{ mt: 1, height: 8, borderRadius: 999, bgcolor: "action.hover" }}
                      />
                    </Box>
                  </Stack>
                </SectionCard>

                <SectionCard
                  title={t("dashboard.recentActivity")}
                  action={
                    <Chip
                      size="small"
                      icon={<InsightsRoundedIcon fontSize="small" />}
                      label={t("dashboard.logsCount", { count: recentLogs.length })}
                    />
                  }
                >
                  {recentLogs.length === 0 ? (
                    <Typography color="text.secondary">{t("dashboard.noActivity")}</Typography>
                  ) : (
                    <Stack spacing={1}>
                      {recentLogs.map((log, index) => (
                        <Box key={log.id}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2">
                              {t("dashboard.activityItem", { amount: log.amount, title: log.title })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {log.date.toLocaleDateString()}
                            </Typography>
                          </Stack>
                          {index < recentLogs.length - 1 && <Divider sx={{ mt: 1 }} />}
                        </Box>
                      ))}
                    </Stack>
                  )}
                </SectionCard>

                <SectionCard title={t("dashboard.completedPreview")}>
                  {completedGoals.length === 0 ? (
                    <Typography color="text.secondary">{t("dashboard.noCompleted")}</Typography>
                  ) : (
                    <Stack spacing={1}>
                      {completedGoals.map((goal) => (
                        <Stack key={goal.id} direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2">{goal.title}</Typography>
                          <Chip size="small" label={t("common.done")} color="success" />
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </SectionCard>
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
