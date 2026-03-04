import { useMemo, useState } from "react";
import {
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGoals } from "../../context/GoalsContext";
import GoalsPageHeader from "../../components/goals/GoalsPageHeader";
import GoalsFilterTabs from "../../components/goals/GoalsFilterTabs";
import GoalsFiltersBar from "../../components/goals/GoalsFiltersBar";
import GoalsGrid from "../../components/goals/GoalsGrid";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { sortAndFilterGoals } from "../../utils/goals";

export default function GoalsListPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const {
    goals,
    addProgress,
    togglePause,
    deleteGoal,
  } = useGoals();

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [goalToDelete, setGoalToDelete] = useState(null);
  const visibleGoals = useMemo(() => goals.filter((goal) => goal.status !== "deleted"), [goals]);
  const stats = useMemo(() => {
    const active = visibleGoals.filter((goal) => goal.status === "active").length;
    const completed = visibleGoals.filter((goal) => goal.status === "completed").length;
    const paused = visibleGoals.filter((goal) => goal.status === "paused").length;
    const avgProgress =
      visibleGoals.length === 0
        ? 0
        : Math.round(
            visibleGoals.reduce(
              (acc, goal) => acc + Math.min((Number(goal.progress) || 0) / Math.max(1, Number(goal.target) || 1), 1),
              0
            ) / visibleGoals.length * 100
          );

    return {
      total: visibleGoals.length,
      active,
      completed,
      paused,
      avgProgress,
    };
  }, [visibleGoals]);

  // Recompute only when input values change.
  const filteredGoals = useMemo(() => {
    return sortAndFilterGoals(visibleGoals, { tab, search, sortBy });
  }, [visibleGoals, tab, search, sortBy]);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={4}>
        <GoalsPageHeader isFa={isFa} />

        {/* Analytics Bar */}
        <Grid container spacing={2}>
          <Grid item xs={6} md={2}>
            <Card>
              <CardContent>
                <Typography variant="caption">Total</Typography>
                <Typography variant="h6">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card>
              <CardContent>
                <Typography variant="caption">Active</Typography>
                <Typography variant="h6">{stats.active}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card>
              <CardContent>
                <Typography variant="caption">Completed</Typography>
                <Typography variant="h6">{stats.completed}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card>
              <CardContent>
                <Typography variant="caption">Paused</Typography>
                <Typography variant="h6">{stats.paused}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card>
              <CardContent>
                <Typography variant="caption">Avg Progress</Typography>
                <Typography variant="h6">{stats.avgProgress}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <GoalsFilterTabs value={tab} onChange={setTab} />
        <GoalsFiltersBar
          search={search}
          sortBy={sortBy}
          onSearchChange={setSearch}
          onSortByChange={setSortBy}
          isFa={isFa}
        />

        {/* Final rendered list after filter/sort is applied. */}
        <GoalsGrid
          goals={filteredGoals}
          onAddProgress={(goalId) => addProgress(goalId, 1)}
          onTogglePause={togglePause}
          onEdit={(goalId) => navigate(`/goals/${goalId}/edit`)}
          onDelete={(goalId) => {
            const targetGoal = visibleGoals.find((goal) => goal.id === goalId);
            if (targetGoal) setGoalToDelete(targetGoal);
          }}
        />
      </Stack>

      <ConfirmDialog
        open={Boolean(goalToDelete)}
        title={`⚠️ ${isFa ? "مطمئن هستید؟" : "Are you sure?"}`}
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
    </Container>
  );
}
