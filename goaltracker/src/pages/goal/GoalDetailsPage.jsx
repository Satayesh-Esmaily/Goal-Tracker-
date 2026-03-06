import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SectionCard from "../../components/common/SectionCard";
import { useGoals } from "../../context/GoalsContext";

function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString();
}

function formatDateTime(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
}

function StatCard({ icon, label, value, color, statCardSx }) {
  return (
    <Card elevation={0} sx={statCardSx}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ color }}>{icon}</Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Stack>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export function GoalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const { goals } = useGoals();

  const goal = useMemo(() => goals.find((item) => item.id === id), [goals, id]);

  if (!goal) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            textAlign: "center",
            p: { xs: 2, md: 4 },
          }}
        >
          <Stack spacing={1.5} alignItems="center">
            <Typography variant="h5" fontWeight={900}>
              Goal Not Found
            </Typography>
            <Typography color="text.secondary">
              This goal does not exist or may have been removed.
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate("/goals")}
            >
              Back To Goals
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  const target = Math.max(1, Number(goal.target) || 1);
  const progress = Math.max(0, Number(goal.progress) || 0);
  const progressPct = Math.round((Math.min(progress, target) / target) * 100);
  const remaining = Math.max(target - progress, 0);
  const logs = Array.isArray(goal.logs) ? [...goal.logs].reverse() : [];

  const statusColor =
    goal.status === "completed"
      ? "success"
      : goal.status === "paused"
      ? "warning"
      : "info";

  const statCardSx = {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 3,
    height: "100%",
    background: isDark
      ? `linear-gradient(180deg, ${alpha(
          theme.palette.background.paper,
          0.92
        )}, ${alpha(theme.palette.background.paper, 0.72)})`
      : `linear-gradient(180deg, ${alpha(
          theme.palette.background.paper,
          0.96
        )}, ${alpha("#f8fafc", 0.94)})`,
    boxShadow: isDark
      ? "0 12px 30px rgba(2,6,23,0.32)"
      : "0 8px 24px rgba(15,23,42,0.08)",
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: alpha(primary, 0.35),
            borderRadius: 3.2,
            background: isDark
              ? `linear-gradient(120deg, ${alpha(primary, 0.24)}, ${alpha(
                  theme.palette.background.paper,
                  0.9
                )})`
              : `linear-gradient(120deg, ${alpha(primary, 0.12)}, ${alpha(
                  "#ffffff",
                  0.94
                )})`,
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
            >
              <Stack spacing={1}>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  sx={{ wordBreak: "break-word" }}
                >
                  {goal.title}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip size="small" label={goal.category || "Personal"} />
                  <Chip size="small" label={goal.type || "daily"} variant="outlined" />
                  <Chip size="small" label={goal.priority || "Medium"} variant="outlined" />
                  <Chip
                    size="small"
                    color={statusColor}
                    label={goal.status || "active"}
                    sx={{ textTransform: "capitalize" }}
                  />
                </Stack>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} gap={1.2} sx={{ width: { xs: "100%", md: "auto" } }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackRoundedIcon />}
                  onClick={() => navigate("/goals")}
                  fullWidth
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  startIcon={<EditRoundedIcon />}
                  onClick={() => navigate(`/goals/${goal.id}/edit`)}
                  fullWidth
                >
                  Edit Goal
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<TrackChangesRoundedIcon fontSize="small" />}
              label="Progress"
              value={`${progressPct}%`}
              color={primary}
              statCardSx={statCardSx}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<TrackChangesRoundedIcon fontSize="small" />}
              label="Current"
              value={`${progress}/${target}`}
              color={theme.palette.info.main}
              statCardSx={statCardSx}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<TrackChangesRoundedIcon fontSize="small" />}
              label="Remaining"
              value={`${remaining}`}
              color={theme.palette.warning.main}
              statCardSx={statCardSx}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<HistoryRoundedIcon fontSize="small" />}
              label="Logs"
              value={`${logs.length}`}
              color={theme.palette.success.main}
              statCardSx={statCardSx}
            />
          </Grid>
        </Grid>

        <SectionCard
          title="Progress Overview"
          sx={{
            borderColor: alpha(primary, 0.24),
            background: isDark
              ? `linear-gradient(180deg, ${alpha(
                  theme.palette.background.paper,
                  0.9
                )}, ${alpha(theme.palette.background.paper, 0.78)})`
              : `linear-gradient(180deg, ${alpha("#ffffff", 0.96)}, ${alpha(
                  "#f8fafc",
                  0.9
                )})`,
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {progress}/{target} {goal.unit || ""}
              </Typography>
              <Chip size="small" label={`${progressPct}%`} />
            </Stack>
            <Box
              sx={{
                height: 12,
                borderRadius: 999,
                overflow: "hidden",
                bgcolor: isDark
                  ? "rgba(148,163,184,0.2)"
                  : "rgba(148,163,184,0.24)",
              }}
            >
              <Box
                sx={{
                  width: `${progressPct}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${
                    goal.color || primary
                  }, ${alpha(primary, 0.7)})`,
                }}
              />
            </Box>
          </Stack>
        </SectionCard>

        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <SectionCard title="Planning & Schedule">
              <Stack spacing={1.2}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonthRoundedIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">Start Date</Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={700}>{formatDate(goal.startDate)}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonthRoundedIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">End Date</Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={700}>{formatDate(goal.endDate)}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonthRoundedIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">Deadline</Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={700}>{formatDate(goal.deadline)}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeRoundedIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">Start Time</Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={700}>{goal.startTime || "-"}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeRoundedIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">End Time</Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={700}>{goal.endTime || "-"}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TrackChangesRoundedIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">Frequency</Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={700}>{goal.frequency || "-"}</Typography>
                </Stack>
              </Stack>
            </SectionCard>
          </Grid>

          <Grid item xs={12} md={7}>
            <SectionCard
              title="Activity Timeline"
              action={<Chip size="small" label={`${logs.length} records`} />}
            >
              {logs.length === 0 ? (
                <Typography color="text.secondary">No logs yet.</Typography>
              ) : (
                <Stack
                  spacing={1}
                  sx={{
                    maxHeight: 340,
                    overflowY: "auto",
                    pr: 0.4,
                    "&::-webkit-scrollbar": { width: 8 },
                    "&::-webkit-scrollbar-thumb": {
                      borderRadius: 99,
                      backgroundColor: isDark
                        ? "rgba(148,163,184,0.35)"
                        : "rgba(100,116,139,0.35)",
                    },
                  }}
                >
                  {logs.map((log, idx) => (
                    <Box
                      key={`${log.date}-${idx}`}
                      sx={{
                        minHeight: 46,
                        px: 1.25,
                        py: 0.95,
                        borderRadius: 2.2,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: isDark ? alpha("#1e293b", 0.35) : alpha("#f8fafc", 0.85),
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.2}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{ lineHeight: 1.35, fontSize: { xs: "0.82rem", sm: "0.9rem" } }}
                        >
                          {formatDateTime(log.date)}
                        </Typography>
                        <Chip size="small" color="primary" label={`+${log.amount || 0}`} sx={{ fontWeight: 700 }} />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </SectionCard>
          </Grid>
        </Grid>

        <SectionCard title="Notes">
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <NotesRoundedIcon color="primary" fontSize="small" sx={{ mt: 0.3 }} />
            <Typography
              sx={{
                color: goal.notes ? "text.primary" : "text.secondary",
                whiteSpace: "pre-wrap",
                lineHeight: 1.8,
              }}
            >
              {goal.notes || "No notes added for this goal."}
            </Typography>
          </Stack>
        </SectionCard>
      </Stack>
    </Container>
  );
}

export default GoalDetailsPage;
