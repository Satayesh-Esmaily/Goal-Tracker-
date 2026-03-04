import { useMemo, useState } from "react";
import {
  Container,
  Stack,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Checkbox,
  FormControlLabel,
  Skeleton,
  Chip,
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
import CategoriesProgressChart from "../../components/categories/CategoriesProgressChart";

export default function GoalsListPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const {
    goals,
    addProgress,
    togglePause,
    deleteGoal,
    archiveGoal,
    restoreGoal,
  } = useGoals();

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [selectedGoals, setSelectedGoals] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const filteredGoals = useMemo(
    () => sortAndFilterGoals(goals, { tab, search, sortBy }),
    [goals, tab, search, sortBy]
  );

  // Analytics
  const stats = useMemo(() => {
    const total = goals.length;
    const active = goals.filter((g) => g.status === "active").length;
    const completed = goals.filter((g) => g.status === "completed").length;
    const paused = goals.filter((g) => g.status === "paused").length;
    const avgProgress =
      total === 0
        ? 0
        : Math.round(
            goals.reduce(
              (sum, g) => sum + (g.progress / Math.max(1, g.target)) * 100,
              0
            ) / total
          );
    return { total, active, completed, paused, avgProgress };
  }, [goals]);

  // Bulk Actions
  const toggleSelectGoal = (id) => {
    const newSet = new Set(selectedGoals);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedGoals(newSet);
  };

  const clearSelection = () => setSelectedGoals(new Set());
  const bulkDelete = () => {
    selectedGoals.forEach((id) => deleteGoal(id));
    clearSelection();
  };
  const bulkPause = () => {
    selectedGoals.forEach((id) => togglePause(id));
    clearSelection();
  };
  const bulkComplete = () => {
    selectedGoals.forEach((id) =>
      addProgress(id, goals.find((g) => g.id === id).target)
    ); // mark complete
    clearSelection();
  };

  // Loading simulation
  const displayGoals = loading ? Array(5).fill({}) : filteredGoals;

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

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, val) => val && setViewMode(val)}
            size="small"
          >
            <ToggleButton value="grid">Grid</ToggleButton>
            <ToggleButton value="list">List</ToggleButton>
            <ToggleButton value="compact">Compact</ToggleButton>
          </ToggleButtonGroup>

          {selectedGoals.size > 0 && (
            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="error" onClick={bulkDelete}>
                Delete ({selectedGoals.size})
              </Button>
              <Button variant="contained" onClick={bulkPause}>
                Pause ({selectedGoals.size})
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={bulkComplete}
              >
                Complete ({selectedGoals.size})
              </Button>
            </Stack>
          )}
        </Box>

        <Grid container spacing={2}>
          {displayGoals.length === 0 ? (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No goals found
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate("/goals/new")}
              >
                + Create your first goal
              </Button>
            </Box>
          ) : (
            displayGoals.map((goal) => (
              <Grid
                item
                xs={12}
                sm={viewMode === "grid" ? 6 : 12}
                md={viewMode === "compact" ? 12 : 4}
                key={goal.id || Math.random()}
              >
                {loading ? (
                  <Skeleton variant="rectangular" height={100} />
                ) : (
                  <Card sx={{ position: "relative" }}>
                    <CardContent>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedGoals.has(goal.id)}
                            onChange={() => toggleSelectGoal(goal.id)}
                          />
                        }
                        label=""
                      />
                      <Typography variant="h6">{goal.title}</Typography>
                      <Chip label={goal.category} size="small" sx={{ mt: 1 }} />
                      <Typography variant="body2">
                        Progress: {goal.progress}/{goal.target} (
                        {Math.round(
                          (goal.progress / Math.max(1, goal.target)) * 100
                        )}
                        %)
                      </Typography>
                      <Stack direction="row" spacing={1} mt={1}>
                        <Button
                          size="small"
                          onClick={() => addProgress(goal.id, 1)}
                        >
                          ✅ Add Progress
                        </Button>
                        <Button
                          size="small"
                          onClick={() => navigate(`/goals/${goal.id}/edit`)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          size="small"
                          onClick={() => togglePause(goal.id)}
                        >
                          {goal.status === "paused" ? "▶️ Resume" : "⏸ Pause"}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => setGoalToDelete(goal)}
                        >
                          🗑 Delete
                        </Button>
                        {goal.status === "completed" && (
                          <Button
                            size="small"
                            onClick={() => restoreGoal(goal.id)}
                          >
                            ↩ Restore
                          </Button>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            ))
          )}
        </Grid>

        {stats.total > 0 && !loading && (
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>
                📊 Insights
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You have completed {stats.completed} goals, paused{" "}
                {stats.paused}, and your average progress is {stats.avgProgress}
                %.
              </Typography>
              <CategoriesProgressChart categories={goals} />
            </CardContent>
          </Card>
        )}
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
