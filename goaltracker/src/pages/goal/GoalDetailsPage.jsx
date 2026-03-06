import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
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
  const remaining = Math.max(target - progress, 0);
  const statusText = (goal.status || "active").toString();
  const infoCardSx = {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 3,
    height: "100%",
    background: isDark
      ? `linear-gradient(180deg, ${alpha("#0f172a", 0.94)}, ${alpha(
          "#0f172a",
          0.8
        )})`
      : `linear-gradient(180deg, ${alpha("#ffffff", 0.98)}, ${alpha(
          "#f8fafc",
          0.95
        )})`,
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2.5, md: 4 } }}>
      <Stack spacing={2.2}>
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.35),
            borderRadius: 3.5,
            background: isDark
              ? `linear-gradient(130deg, ${alpha(
                  theme.palette.primary.main,
                  0.22
                )}, ${alpha("#0f172a", 0.86)})`
              : `linear-gradient(130deg, ${alpha(
                  theme.palette.primary.main,
                  0.14
                )}, ${alpha("#ffffff", 0.92)})`,
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 2.6 } }}>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              justifyContent="space-between"
              spacing={2}
              alignItems={{ xs: "flex-start", lg: "center" }}
            >
              <Stack spacing={1}>
                <Stack direction="row" spacing={1.1} alignItems="center">
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: alpha(theme.palette.primary.main, 0.18),
                      color: theme.palette.primary.main,
                    }}
                  >
                    <CategoryRoundedIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="h4" fontWeight={900}>
                    {goal.title}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip size="small" label={goal.category || "Personal"} />
                  <Chip size="small" label={goal.type || "daily"} variant="outlined" />
                  <Chip size="small" label={goal.priority || "Medium"} variant="outlined" />
                  <Chip
                    size="small"
                    color={statusColor}
                    icon={<CheckCircleRoundedIcon sx={{ fontSize: 16 }} />}
                    label={statusText}
                    sx={{ textTransform: "capitalize" }}
                  />
                </Stack>
              </Stack>

              <Stack direction={{ xs: "row", sm: "row" }} spacing={1.1}>
                <Button variant="outlined" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate("/goals")}>
                  Back
                </Button>
                <Button variant="contained" startIcon={<EditRoundedIcon />} onClick={() => navigate(`/goals/${goal.id}/edit`)}>
                  Edit Goal
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={12} md={7} lg={8}>
            <Card elevation={0} sx={infoCardSx}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TimelineRoundedIcon color="primary" />
                      <Typography fontWeight={800}>Progress Overview</Typography>
                    </Stack>
                    <Chip
                      size="small"
                      icon={<BoltRoundedIcon sx={{ fontSize: 16 }} />}
                      label={`${percent}% Complete`}
                      color="primary"
                      variant={isDark ? "filled" : "outlined"}
                    />
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
                    <Typography variant="h4" fontWeight={900}>
                      {progress}/{target} {goal.unit || ""}
                    </Typography>
                    <Typography color="text.secondary">
                      Remaining: <strong>{remaining}</strong> {goal.unit || ""}
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{
                      height: 14,
                      borderRadius: 999,
                      bgcolor: isDark ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.24)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        background: `linear-gradient(90deg, ${
                          goal.color || theme.palette.primary.main
                        }, ${theme.palette.primary.main})`,
                      },
                    }}
                  />

                  <Grid container spacing={1.25}>
                    <Grid item xs={12} sm={4}>
                      <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid", borderColor: "divider", bgcolor: "transparent" }}>
                        <CardContent sx={{ p: 1.5 }}>
                          <Typography variant="caption" color="text.secondary">Target</Typography>
                          <Typography fontWeight={800}>{target} {goal.unit || ""}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid", borderColor: "divider", bgcolor: "transparent" }}>
                        <CardContent sx={{ p: 1.5 }}>
                          <Typography variant="caption" color="text.secondary">Current</Typography>
                          <Typography fontWeight={800}>{progress} {goal.unit || ""}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid", borderColor: "divider", bgcolor: "transparent" }}>
                        <CardContent sx={{ p: 1.5 }}>
                          <Typography variant="caption" color="text.secondary">Logs</Typography>
                          <Typography fontWeight={800}>{logs.length}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5} lg={4}>
            <Card elevation={0} sx={infoCardSx}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack spacing={1.35}>
                  <Typography fontWeight={800}>Goal Details</Typography>
                  <DetailItem icon={<CalendarMonthRoundedIcon fontSize="small" />} label="Start Date" value={formatDate(goal.startDate) || "-"} />
                  <DetailItem icon={<CalendarMonthRoundedIcon fontSize="small" />} label="End Date" value={formatDate(goal.endDate) || "-"} />
                  <DetailItem icon={<CalendarMonthRoundedIcon fontSize="small" />} label="Deadline" value={formatDate(goal.deadline) || "-"} />
                  <Divider />
                  <DetailItem icon={<AccessTimeRoundedIcon fontSize="small" />} label="Start Time" value={goal.startTime || "-"} />
                  <DetailItem icon={<AccessTimeRoundedIcon fontSize="small" />} label="End Time" value={goal.endTime || "-"} />
                  <DetailItem icon={<TimelineRoundedIcon fontSize="small" />} label="Frequency" value={goal.frequency || "-"} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} lg={5}>
            <Card elevation={0} sx={infoCardSx}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack spacing={1.3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <NotesRoundedIcon color="primary" fontSize="small" />
                    <Typography fontWeight={800}>Notes</Typography>
                  </Stack>
                  <Typography
                    sx={{
                      color: goal.notes ? "text.primary" : "text.secondary",
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.75,
                      minHeight: 110,
                    }}
                  >
                    {goal.notes || "No notes added for this goal."}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={7}>
            <Card elevation={0} sx={infoCardSx}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack spacing={1.1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={800}>Progress Logs</Typography>
                    <Chip size="small" label={`${logs.length} entries`} />
                  </Stack>
                  {logs.length === 0 ? (
                    <Typography color="text.secondary">No logs yet.</Typography>
                  ) : (
                    <Stack spacing={0.9} sx={{ maxHeight: 305, overflowY: "auto", pr: 0.5 }}>
                      {logs.map((log, idx) => (
                        <Box key={`${log.date}-${idx}`}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              {new Date(log.date).toLocaleString()}
                            </Typography>
                            <Chip size="small" color="primary" variant={isDark ? "filled" : "outlined"} label={`+${log.amount || 0}`} />
                          </Stack>
                          {idx < logs.length - 1 && <Divider sx={{ mt: 1 }} />}
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
