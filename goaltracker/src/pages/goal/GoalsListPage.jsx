import { useMemo, useState } from "react";
import {
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  alpha,
  Tooltip,
  LinearProgress,
  Divider,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import GoalsPageHeader from "../../components/goals/GoalsPageHeader";
import GoalsFilterTabs from "../../components/goals/GoalsFilterTabs";
import GoalsFiltersBar from "../../components/goals/GoalsFiltersBar";
import GoalsGrid from "../../components/goals/GoalsGrid";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";

import { useGoals } from "../../context/GoalsContext";
import { sortAndFilterGoals } from "../../utils/goals";

export default function GoalsListPage() {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const isFa = i18n.language === "fa";

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

  const filteredGoals = useMemo(() => {
    return sortAndFilterGoals(visibleGoals, { tab, search, sortBy });
  }, [visibleGoals, tab, search, sortBy]);

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
        logs,
      })
    );

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(goalsToExport, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "goals_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={4}>
        <GoalsPageHeader isFa={isFa} />

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ mb: 2, flexWrap: "wrap", justifyContent: "space-between" }}
        >
          <Tooltip title={isFa ? "ایجاد هدف جدید" : "Create New Goal"}>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => navigate("/goals/new")}
            >
              {isFa ? "هدف جدید" : "New Goal"}
            </Button>
          </Tooltip>

          <Tooltip title={isFa ? "خروجی گرفتن اهداف" : "Export Goals"}>
            <Button
              variant="outlined"
              startIcon={<DownloadRoundedIcon />}
              onClick={handleExport}
              sx={{ px: isFa ? 2.75 : 2 }}
              disabled={visibleGoals.length === 0}
            >
              {isFa ? "خروجی گرفتن" : "Export"}
            </Button>
          </Tooltip>
        </Stack>

        {visibleGoals.length > 0 && (
          <Card elevation={0} sx={{ borderRadius: 3, p: 2 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Typography variant="body2">
                {t("goalsPage.total")}: {stats.total}
              </Typography>
              <Typography variant="body2" color="success.main">
                {t("goalsPage.active")}: {stats.active}
              </Typography>
              <Typography variant="body2" color="primary.main">
                {t("goalsPage.completed")}: {stats.completed}
              </Typography>
              <Typography variant="body2" color="warning.main">
                {t("goalsPage.paused")}: {stats.paused}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">
                  {t("goalsPage.avgProgress")}:
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={stats.avgProgress}
                  sx={{ width: 120, height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2">{stats.avgProgress}%</Typography>
              </Stack>
            </Stack>
          </Card>
        )}

        <GoalsFilterTabs value={tab} onChange={setTab} />
        <GoalsFiltersBar
          search={search}
          sortBy={sortBy}
          onSearchChange={setSearch}
          onSortByChange={setSortBy}
          isFa={isFa}
        />

        {filteredGoals.length === 0 ? (
          <EmptyState message={isFa ? "هیچ هدفی یافت نشد" : "No goals found"} />
        ) : (
          <GoalsGrid
            goals={filteredGoals}
            onAddProgress={(goalId) => addProgress(goalId, 1)}
            onTogglePause={togglePause}
            onEdit={(goalId) => navigate(`/goals/${goalId}/edit`)}
            onDelete={(goalId) => {
              const targetGoal = visibleGoals.find(
                (goal) => goal.id === goalId
              );
              if (targetGoal) setGoalToDelete(targetGoal);
            }}
          />
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
