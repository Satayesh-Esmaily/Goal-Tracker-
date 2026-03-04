import { useMemo, useState } from "react";
import {
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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
    const active = visibleGoals.filter(
      (goal) => goal.status === "active"
    ).length;
    const completed = visibleGoals.filter(
      (goal) => goal.status === "completed"
    ).length;
    const paused = visibleGoals.filter(
      (goal) => goal.status === "paused"
    ).length;
    const avgProgress =
      visibleGoals.length === 0
        ? 0
        : Math.round(
            (visibleGoals.reduce(
              (acc, goal) =>
                acc +
                Math.min(
                  (Number(goal.progress) || 0) /
                    Math.max(1, Number(goal.target) || 1),
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

  const cardBgGradient = isDark
    ? `linear-gradient(180deg, ${alpha(
        theme.palette.background.paper,
        0.92
      )}, ${alpha(theme.palette.background.paper, 0.72)})`
    : `linear-gradient(180deg, ${alpha(
        theme.palette.background.paper,
        0.96
      )}, ${alpha("#f8fafc", 0.94)})`;

  const cardBorderColor = isDark
    ? "rgba(148,163,184,0.35)"
    : "rgba(148,163,184,0.3)";
  const cardShadow = isDark
    ? "0 14px 36px rgba(2,6,23,0.32)"
    : "0 10px 30px rgba(15,23,42,0.08)";

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={4}>
        <GoalsPageHeader isFa={isFa} />

        <Grid container spacing={2}>
          {[
            { label: "Total", value: stats.total },
            { label: "Active", value: stats.active },
            { label: "Completed", value: stats.completed },
            { label: "Paused", value: stats.paused },
            { label: "Avg Progress", value: `${stats.avgProgress}%` },
          ].map((stat, idx) => (
            <Grid item xs={6} md={2} key={idx}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  background: cardBgGradient,
                  border: "1px solid",
                  borderColor: cardBorderColor,
                  boxShadow: cardShadow,
                  transition:
                    "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: alpha(theme.palette.primary.main, 0.58),
                    boxShadow: isDark
                      ? "0 18px 40px rgba(2,6,23,0.45)"
                      : "0 16px 36px rgba(15,23,42,0.12)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="caption">{stat.label}</Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <GoalsFilterTabs value={tab} onChange={setTab} />
        <GoalsFiltersBar
          search={search}
          sortBy={sortBy}
          onSearchChange={setSearch}
          onSortByChange={setSortBy}
          isFa={isFa}
        />

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
