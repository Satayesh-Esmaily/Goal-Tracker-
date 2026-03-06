import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
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
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SectionCard from "../../components/common/SectionCard";
import { useGoals } from "../../context/GoalsContext";

function formatDate(value, locale) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString(locale);
}

function formatDateTime(value, locale) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString(locale);
}

function StatTile({ icon, label, value, color, sx }) {
  return (
    <Card elevation={0} sx={sx}>
      <CardContent sx={{ p: 1.8 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1.2,
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(color, 0.16),
              color,
            }}
          >
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Stack>
        <Typography variant="h5" fontWeight={900} sx={{ mt: 1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
        {icon}
        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>
      </Stack>
      <Typography variant="body2" fontWeight={800} sx={{ textAlign: "right" }}>
        {value}
      </Typography>
    </Stack>
  );
}

export function GoalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const locale = i18n.language === "fa" ? "fa-IR" : "en-US";
  const { goals } = useGoals();

  const goal = useMemo(() => goals.find((item) => item.id === id), [goals, id]);

  if (!goal) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: { xs: 2, md: 4 } }}>
          <Stack spacing={1.5} alignItems="center">
            <Typography variant="h5" fontWeight={900}>
              {t("goalDetails.notFoundTitle")}
            </Typography>
            <Typography color="text.secondary">{t("goalDetails.notFoundDesc")}</Typography>
            <Button variant="contained" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate("/goals")}>
              {t("goalDetails.backToGoals")}
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

  const cardSx = {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 3,
    height: "100%",
    background: isDark
      ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.92)}, ${alpha(theme.palette.background.paper, 0.78)})`
      : `linear-gradient(180deg, ${alpha("#ffffff", 0.98)}, ${alpha("#f8fafc", 0.94)})`,
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: alpha(primary, 0.4),
            borderRadius: 3.4,
            background: isDark
              ? `linear-gradient(120deg, ${alpha(primary, 0.22)}, ${alpha(theme.palette.background.paper, 0.9)})`
              : `linear-gradient(120deg, ${alpha(primary, 0.12)}, ${alpha("#ffffff", 0.96)})`,
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
              <Stack spacing={1}>
                <Typography variant="h4" fontWeight={900} sx={{ wordBreak: "break-word" }}>
                  {goal.title}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip size="small" label={goal.category || "Personal"} />
                  <Chip size="small" label={goal.type || "daily"} variant="outlined" />
                  <Chip size="small" label={goal.priority || "Medium"} variant="outlined" />
                  <Chip
                    size="small"
                    color={statusColor}
                    label={t(`common.${goal.status || "active"}`)}
                    sx={{ textTransform: "capitalize" }}
                  />
                </Stack>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} gap={1.1} sx={{ width: { xs: "100%", md: "auto" } }}>
                <Button variant="outlined" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate("/goals")} fullWidth>
                  {t("goalDetails.back")}
                </Button>
                <Button variant="contained" startIcon={<EditRoundedIcon />} onClick={() => navigate(`/goals/${goal.id}/edit`)} fullWidth>
                  {t("goalDetails.editGoal")}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <StatTile
              icon={<InsightsRoundedIcon fontSize="small" />}
              label={t("goalDetails.progress")}
              value={`${progressPct}%`}
              color={primary}
              sx={cardSx}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatTile
              icon={<TrackChangesRoundedIcon fontSize="small" />}
              label={t("goalDetails.current")}
              value={`${progress}/${target}`}
              color={theme.palette.info.main}
              sx={cardSx}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatTile
              icon={<TrackChangesRoundedIcon fontSize="small" />}
              label={t("goalDetails.remaining")}
              value={remaining}
              color={theme.palette.warning.main}
              sx={cardSx}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatTile
              icon={<HistoryRoundedIcon fontSize="small" />}
              label={t("goalDetails.logs")}
              value={logs.length}
              color={theme.palette.success.main}
              sx={cardSx}
            />
          </Grid>
        </Grid>

        <SectionCard
          title={t("goalDetails.progressOverview")}
          sx={{
            borderColor: alpha(primary, 0.24),
            background: isDark
              ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.8)})`
              : `linear-gradient(180deg, ${alpha("#ffffff", 0.97)}, ${alpha("#f8fafc", 0.92)})`,
          }}
        >
          <Stack spacing={1.2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {progress}/{target} {goal.unit || ""}
              </Typography>
              <Chip size="small" label={`${progressPct}%`} />
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progressPct}
              sx={{
                height: 12,
                borderRadius: 999,
                bgcolor: isDark ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.24)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${goal.color || primary}, ${alpha(primary, 0.7)})`,
                },
              }}
            />
          </Stack>
        </SectionCard>

        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <SectionCard title={t("goalDetails.planningSchedule")} sx={cardSx}>
              <Stack spacing={1.2}>
                <DetailRow
                  icon={<CalendarMonthRoundedIcon fontSize="small" color="action" />}
                  label={t("goalDetails.startDate")}
                  value={formatDate(goal.startDate, locale)}
                />
                <DetailRow
                  icon={<CalendarMonthRoundedIcon fontSize="small" color="action" />}
                  label={t("goalDetails.endDate")}
                  value={formatDate(goal.endDate, locale)}
                />
                <DetailRow
                  icon={<CalendarMonthRoundedIcon fontSize="small" color="action" />}
                  label={t("goalDetails.deadline")}
                  value={formatDate(goal.deadline, locale)}
                />
                <DetailRow
                  icon={<AccessTimeRoundedIcon fontSize="small" color="action" />}
                  label={t("goalDetails.startTime")}
                  value={goal.startTime || "-"}
                />
                <DetailRow
                  icon={<AccessTimeRoundedIcon fontSize="small" color="action" />}
                  label={t("goalDetails.endTime")}
                  value={goal.endTime || "-"}
                />
                <DetailRow
                  icon={<TrackChangesRoundedIcon fontSize="small" color="action" />}
                  label={t("goalDetails.frequency")}
                  value={goal.frequency || "-"}
                />
              </Stack>
            </SectionCard>
          </Grid>

          <Grid item xs={12} md={7}>
            <SectionCard
              title={t("goalDetails.activityTimeline")}
              action={<Chip size="small" label={t("goalDetails.records", { count: logs.length })} />}
              sx={cardSx}
            >
              {logs.length === 0 ? (
                <Typography color="text.secondary">{t("goalDetails.noLogs")}</Typography>
              ) : (
                <Stack
                  spacing={1}
                  sx={{
                    maxHeight: 340,
                    overflowY: "auto",
                    pr: 0.5,
                    "&::-webkit-scrollbar": { width: 8 },
                    "&::-webkit-scrollbar-thumb": {
                      borderRadius: 999,
                      backgroundColor: isDark ? "rgba(148,163,184,0.35)" : "rgba(100,116,139,0.35)",
                    },
                  }}
                >
                  {logs.map((log, idx) => (
                    <Box
                      key={`${log.date}-${idx}`}
                      sx={{
                        minHeight: 48,
                        px: 1.4,
                        py: 1,
                        borderRadius: 2.2,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: isDark ? alpha("#1e293b", 0.34) : alpha("#f8fafc", 0.9),
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.2}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{ lineHeight: 1.35, fontSize: { xs: "0.82rem", sm: "0.9rem" } }}
                        >
                          {formatDateTime(log.date, locale)}
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

        <SectionCard title={t("goalDetails.notes")} sx={cardSx}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <NotesRoundedIcon color="primary" fontSize="small" sx={{ mt: 0.3 }} />
            <Typography
              sx={{
                color: goal.notes ? "text.primary" : "text.secondary",
                whiteSpace: "pre-wrap",
                lineHeight: 1.8,
              }}
            >
              {goal.notes || t("goalDetails.noNotes")}
            </Typography>
          </Stack>
        </SectionCard>
      </Stack>
    </Container>
  );
}

export default GoalDetailsPage;
