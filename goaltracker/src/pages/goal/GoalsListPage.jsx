import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FlagCircleOutlinedIcon from "@mui/icons-material/FlagCircleOutlined";
import PauseCircleOutlineRoundedIcon from "@mui/icons-material/PauseCircleOutlineRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import GoalsGrid from "../../components/goals/GoalsGrid";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import SectionCard from "../../components/common/SectionCard";
import { useGoals } from "../../context/GoalsContext";
import { sortAndFilterGoals } from "../../utils/goals";
import ExportButton from "../../components/common/ExportButton";

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

export default function GoalsListPage() {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const isFa = i18n.language === "fa";
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  const { goals, addProgress, togglePause, deleteGoal } = useGoals();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [goalToDelete, setGoalToDelete] = useState(null);

  const visibleGoals = useMemo(
    () => goals.filter((goal) => goal.status !== "deleted"),
    [goals]
  );

  const stats = useMemo(() => {
    const active = visibleGoals.filter((g) => g.status === "active").length;
    const completed = visibleGoals.filter(
      (g) => g.status === "completed"
    ).length;
    const paused = visibleGoals.filter((g) => g.status === "paused").length;
    const avgProgress =
      visibleGoals.length === 0
        ? 0
        : Math.round(
            (visibleGoals.reduce(
              (acc, g) =>
                acc +
                Math.min(
                  (Number(g.progress) || 0) /
                    Math.max(1, Number(g.target) || 1),
                  1
                ),
              0
            ) /
              visibleGoals.length) *
              100
          );
    return {
      total: visibleGoals.length,
      active,
      completed,
      paused,
      avgProgress,
    };
  }, [visibleGoals]);

  const filteredGoals = useMemo(
    () => sortAndFilterGoals(visibleGoals, { tab, search, sortBy }),
    [visibleGoals, tab, search, sortBy]
  );

  const handleExport = () => {
    if (!visibleGoals.length) return;
    const goalsToExport = visibleGoals.map(
      ({
        id,
        title,
        category,
        type,
        target,
        progress,
        status,
        startDate,
        endDate,
        deadline,
        logs,
      }) => ({
        id,
        title,
        category,
        type,
        target,
        progress,
        status,
        startDate,
        endDate,
        deadline,
        logs,
      })
    );

    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(goalsToExport, null, 2)
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

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
    transition:
      "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: alpha(primary, 0.55),
      boxShadow: isDark
        ? "0 16px 34px rgba(2,6,23,0.44)"
        : "0 12px 28px rgba(15,23,42,0.12)",
    },
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
              <Stack spacing={0.75}>
                <Typography variant="h4" fontWeight={900}>
                  {t("goalsPage.title")}
                </Typography>
                <Typography color="text.secondary">
                  {isFa
                    ? "اهداف خود را مدیریت، فیلتر و پیگیری کنید."
                    : "Manage, filter, and track all your goals."}
                </Typography>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
                <Button
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => navigate("/goals/new")}
                >
                  {isFa ? "هدف جدید" : "New Goal"}
                </Button>
                <ExportButton
                  goals={visibleGoals}
                  fileName="goals_export.json"
                  disabled={visibleGoals.length === 0}
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<TrackChangesRoundedIcon fontSize="small" />}
              label={isFa ? "کل اهداف" : "Total Goals"}
              value={stats.total}
              color={primary}
              statCardSx={statCardSx}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<FlagCircleOutlinedIcon fontSize="small" />}
              label={t("common.active")}
              value={stats.active}
              color={theme.palette.info.main}
              statCardSx={statCardSx}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<TaskAltRoundedIcon fontSize="small" />}
              label={t("common.completed")}
              value={stats.completed}
              color={theme.palette.success.main}
              statCardSx={statCardSx}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<PauseCircleOutlineRoundedIcon fontSize="small" />}
              label={t("common.paused")}
              value={stats.paused}
              color={theme.palette.warning.main}
              statCardSx={statCardSx}
            />
          </Grid>
          <Grid item xs={12}>
            <Card elevation={0} sx={statCardSx}>
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TimelineRoundedIcon
                      sx={{ color: primary }}
                      fontSize="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {isFa ? "میانگین پیشرفت" : "Average Progress"}
                    </Typography>
                  </Stack>
                  <Box sx={{ minWidth: 220, width: { xs: "100%", sm: 320 } }}>
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
                          width: `${stats.avgProgress}%`,
                          height: "100%",
                          borderRadius: 999,
                          background: `linear-gradient(90deg, ${primary}, ${alpha(
                            primary,
                            0.65
                          )})`,
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight={800}>
                    {stats.avgProgress}%
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <SectionCard
          title={isFa ? "فیلتر و مرتب‌سازی" : "Filters & Sorting"}
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
          <Stack spacing={2}>
            <Tabs
              value={tab}
              onChange={(_, next) => setTab(next)}
              variant="scrollable"
            >
              <Tab
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                }}
                value="all"
                label={isFa ? "همه" : "All"}
              />
              <Tab
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                }}
                value="active"
                label={isFa ? "فعال" : "Active"}
              />
              <Tab
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                }}
                value="paused"
                label={isFa ? "متوقف" : "Paused"}
              />
              <Tab
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                }}
                value="completed"
                label={isFa ? "تکمیل‌شده" : "Completed"}
              />
            </Tabs>

            <Stack direction={{ xs: "column", md: "row" }} gap={1.5}>
              <TextField
                fullWidth
                label={t("goalsPage.searchByTitle")}
                placeholder={
                  isFa ? "عنوان هدف را جستجو کن..." : "Search goals by title..."
                }
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                select
                label={t("goalsPage.sortBy")}
                sx={{ minWidth: 240 }}
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <MenuItem value="newest">{t("goalsPage.newest")}</MenuItem>
                <MenuItem value="progress">{t("goalsPage.progress")}</MenuItem>
                <MenuItem value="category">{t("goalsPage.category")}</MenuItem>
              </TextField>
            </Stack>
          </Stack>
        </SectionCard>

        {filteredGoals.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              textAlign: "center",
              py: { xs: 5, md: 7 },
              px: 2,
              background: isDark
                ? "linear-gradient(180deg, rgba(15,23,42,0.75), rgba(15,23,42,0.55))"
                : "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.92))",
              boxShadow: isDark
                ? "0 12px 30px rgba(2,6,23,0.35)"
                : "0 10px 24px rgba(15,23,42,0.08)",
            }}
          >
            <Stack spacing={1.2} alignItems="center">
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: 99,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: alpha(primary, isDark ? 0.16 : 0.12),
                  color: primary,
                }}
              >
                <Inventory2OutlinedIcon />
              </Box>
              <Typography variant="h6" fontWeight={800}>
                {isFa ? "هیچ هدفی یافت نشد" : "No goals found"}
              </Typography>
              <Typography color="text.secondary">
                {isFa
                  ? "فیلترها را تغییر بده یا هدف جدید بساز."
                  : "Try changing filters or create a new goal."}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/goals/new")}
                sx={{ mt: 1, borderRadius: 999 }}
              >
                {isFa ? "ساخت هدف جدید" : "Create New Goal"}
              </Button>
            </Stack>
          </Card>
        ) : (
          <SectionCard
            title={
              isFa
                ? `لیست اهداف (${filteredGoals.length})`
                : `Goals (${filteredGoals.length})`
            }
          >
            <GoalsGrid
              goals={filteredGoals}
              onAddProgress={(goalId) => addProgress(goalId, 1)}
              onTogglePause={togglePause}
              onViewDetails={(goalId) => navigate(`/goals/${goalId}`)}
              onEdit={(goalId) => navigate(`/goals/${goalId}/edit`)}
              onDelete={(goalId) => {
                const targetGoal = visibleGoals.find(
                  (goal) => goal.id === goalId
                );
                if (targetGoal) setGoalToDelete(targetGoal);
              }}
            />
          </SectionCard>
        )}

        <ConfirmDialog
          open={Boolean(goalToDelete)}
          title={isFa ? "⚠️ مطمئن هستید؟" : "⚠️ Are you sure?"}
          description={
            goalToDelete
              ? `${isFa ? "حذف" : "Delete"} "${goalToDelete.title}"?`
              : ""
          }
          confirmLabel={isFa ? "حذف" : "Delete"}
          onCancel={() => setGoalToDelete(null)}
          onConfirm={() => {
            if (!goalToDelete) return;
            deleteGoal(goalToDelete.id);
            setGoalToDelete(null);
          }}
        />
      </Stack>
    </Container>
  );
}
