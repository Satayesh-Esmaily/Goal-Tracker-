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
import { useGoals } from "../../context/GoalsContext";

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
              bgcolor: color,
              color: "#fff",
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

  const activeGoals = goals.filter((goal) => goal.status !== "completed");
  const completedGoals = goals.filter((goal) => goal.status === "completed").slice(0, 5);
  const recentLogs = goals
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
                <Typography variant="h4" fontWeight={800}>
                  Performance Dashboard
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                  Manage goals, monitor progress, and keep your streak alive.
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} useFlexGap flexWrap="wrap">
                  <Chip size="small" label={`${goals.length} Total Goals`} />
                  <Chip size="small" color="success" label={`${stats.completedCount} Completed`} />
                  <Chip size="small" color="warning" label={`${stats.streak}d Streak`} />
                </Stack>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Button variant="contained" component={RouterLink} to="/goals/new" startIcon={<AddRoundedIcon />}>
                  New Goal
                </Button>
                <Button variant="outlined" component={RouterLink} to="/goals" endIcon={<ArrowOutwardRoundedIcon />}>
                  Manage Goals
                </Button>
              </Stack>
            </Stack>
          </SectionCard>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <MetricCard
                title="Active Goals"
                value={stats.activeCount}
                subtitle="Currently in progress"
                color="#1976d2"
                icon={<FlagCircleOutlinedIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <MetricCard
                title="Completed"
                value={stats.completedCount}
                subtitle="Finished targets"
                color="#2e7d32"
                icon={<CheckCircleOutlineRoundedIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <MetricCard
                title="Current Streak"
                value={`${stats.streak}d`}
                subtitle="Consecutive days"
                color="#ed6c02"
                icon={<LocalFireDepartmentOutlinedIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <MetricCard
                title="Total XP"
                value={stats.xpTotal}
                subtitle="Progress points"
                color="#9c27b0"
                icon={<WorkspacePremiumOutlinedIcon fontSize="small" />}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <SectionCard title="Active Goals" action={<Chip size="small" label={`${activeGoals.length} items`} />}>
                {activeGoals.length === 0 ? (
                  <Typography color="text.secondary">No active goals yet. Create one to get started.</Typography>
                ) : (
                  <Grid container spacing={1.75}>
                    {activeGoals.slice(0, 6).map((goal) => (
                      <Grid size={{ xs: 12, md: 6 }} key={goal.id} sx={{ display: "flex" }}>
                        <GoalCard
                          goal={goal}
                          onAddProgress={() => addProgress(goal.id, 1)}
                          onTogglePause={() => togglePause(goal.id)}
                          onEdit={() => navigate(`/goals/${goal.id}/edit`)}
                          onDelete={() => {
                            if (window.confirm(`Delete "${goal.title}"?`)) deleteGoal(goal.id);
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </SectionCard>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={2.5}>
                <SectionCard title="Completion Insight">
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
                        {stats.completedCount} completed from {goals.length} goals.
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
                  title="Recent Activity"
                  action={
                    <Chip
                      size="small"
                      icon={<InsightsRoundedIcon fontSize="small" />}
                      label={`${recentLogs.length} logs`}
                    />
                  }
                >
                  {recentLogs.length === 0 ? (
                    <Typography color="text.secondary">No activity yet.</Typography>
                  ) : (
                    <Stack spacing={1}>
                      {recentLogs.map((log, index) => (
                        <Box key={log.id}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2">
                              +{log.amount} on <strong>{log.title}</strong>
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

                <SectionCard title="Completed Preview">
                  {completedGoals.length === 0 ? (
                    <Typography color="text.secondary">No completed goals yet.</Typography>
                  ) : (
                    <Stack spacing={1}>
                      {completedGoals.map((goal) => (
                        <Stack key={goal.id} direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2">{goal.title}</Typography>
                          <Chip size="small" label="Done" color="success" />
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
    </Box>
  );
}
