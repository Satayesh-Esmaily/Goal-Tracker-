import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGoals } from "../../context/GoalsContext";

function formatDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString();
}

function DetailItem({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ color: "text.secondary", display: "grid", placeItems: "center" }}>
        {icon}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
      <Typography variant="body2" fontWeight={700}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function GoalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { goals } = useGoals();

  const goal = useMemo(() => goals.find((item) => item.id === id), [goals, id]);

  if (!goal) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 2.5, md: 4 } }}>
        <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="h5" fontWeight={800}>
                Goal Not Found
              </Typography>
              <Typography color="text.secondary">
                This goal does not exist or may have been removed.
              </Typography>
              <Button variant="contained" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate("/goals")}>
                Back to Goals
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const target = Math.max(1, Number(goal.target) || 1);
  const progress = Math.max(0, Number(goal.progress) || 0);
  const percent = Math.round((Math.min(progress, target) / target) * 100);
  const logs = Array.isArray(goal.logs) ? [...goal.logs].reverse() : [];

  const statusColor =
    goal.status === "completed"
      ? "success"
      : goal.status === "paused"
      ? "warning"
      : "info";

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 } }}>
      <Stack spacing={2.5}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1.5}>
          <Stack spacing={0.75}>
            <Typography variant="h4" fontWeight={900}>
              {goal.title}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip size="small" label={goal.category || "Personal"} />
              <Chip size="small" label={goal.type || "daily"} variant="outlined" />
              <Chip size="small" label={goal.priority || "Medium"} variant="outlined" />
              <Chip size="small" color={statusColor} label={goal.status || "active"} />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate("/goals")}>
              Back
            </Button>
            <Button variant="contained" startIcon={<EditRoundedIcon />} onClick={() => navigate(`/goals/${goal.id}/edit`)}>
              Edit Goal
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                background: isDark
                  ? "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(15,23,42,0.78))"
                  : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))",
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TimelineRoundedIcon color="primary" />
                    <Typography fontWeight={800}>Progress Overview</Typography>
                  </Stack>
                  <Typography variant="h5" fontWeight={900}>
                    {progress}/{target} {goal.unit || ""}
                  </Typography>
                  <Box
                    sx={{
                      height: 14,
                      width: "100%",
                      borderRadius: 999,
                      overflow: "hidden",
                      bgcolor: isDark ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.25)",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${percent}%`,
                        borderRadius: 999,
                        background: `linear-gradient(90deg, ${goal.color || theme.palette.primary.main}, ${theme.palette.primary.main})`,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Completion: <strong>{percent}%</strong>
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack spacing={1.25}>
                  <Typography fontWeight={800}>Goal Details</Typography>
                  <DetailItem icon={<CalendarMonthRoundedIcon fontSize="small" />} label="Start Date" value={formatDate(goal.startDate) || "-"} />
                  <DetailItem icon={<CalendarMonthRoundedIcon fontSize="small" />} label="End Date" value={formatDate(goal.endDate) || "-"} />
                  <DetailItem icon={<CalendarMonthRoundedIcon fontSize="small" />} label="Deadline" value={formatDate(goal.deadline) || "-"} />
                  <DetailItem icon={<AccessTimeRoundedIcon fontSize="small" />} label="Start Time" value={goal.startTime || "-"} />
                  <DetailItem icon={<AccessTimeRoundedIcon fontSize="small" />} label="End Time" value={goal.endTime || "-"} />
                  <DetailItem icon={<TimelineRoundedIcon fontSize="small" />} label="Frequency" value={goal.frequency || "-"} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Typography fontWeight={800} sx={{ mb: 1 }}>
                  Notes
                </Typography>
                <Typography color={goal.notes ? "text.primary" : "text.secondary"}>
                  {goal.notes || "No notes added for this goal."}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Typography fontWeight={800} sx={{ mb: 1 }}>
                  Progress Logs
                </Typography>
                {logs.length === 0 ? (
                  <Typography color="text.secondary">No logs yet.</Typography>
                ) : (
                  <Stack spacing={1}>
                    {logs.slice(0, 8).map((log, idx) => (
                      <Box key={`${log.date}-${idx}`}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(log.date) || new Date(log.date).toLocaleString()}
                          </Typography>
                          <Chip size="small" label={`+${log.amount || 0}`} />
                        </Stack>
                        {idx < Math.min(7, logs.length - 1) && <Divider sx={{ mt: 1 }} />}
                      </Box>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
