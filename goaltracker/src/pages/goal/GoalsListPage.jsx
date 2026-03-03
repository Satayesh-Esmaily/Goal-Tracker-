import { useMemo, useState } from "react";
import { Container, Stack } from "@mui/material";
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
  // Slight spacing tweaks for Persian typography.
  const isFa = i18n.language === "fa";
  const { goals, addProgress, togglePause, deleteGoal } = useGoals();
  // UI state for filtering and sorting the goals list.
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [goalToDelete, setGoalToDelete] = useState(null);

  // Recompute only when input values change.
  const filteredGoals = useMemo(() => {
    return sortAndFilterGoals(goals, { tab, search, sortBy });
  }, [goals, tab, search, sortBy]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={isFa ? 5 : 3}>
        <GoalsPageHeader isFa={isFa} />

        {/* Status-based filtering tabs: all, active, paused, completed. */}
        <GoalsFilterTabs value={tab} onChange={setTab} />

        {/* Search + sort controls for the same goal list. */}
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
            const targetGoal = goals.find((goal) => goal.id === goalId);
            if (targetGoal) setGoalToDelete(targetGoal);
          }}
        />
      </Stack>

      <ConfirmDialog
        open={Boolean(goalToDelete)}
        title={`⚠️ ${i18n.language === "fa" ? "مطمئن هستید؟" : "Are you sure?"}`}
        description={goalToDelete ? `${i18n.language === "fa" ? "حذف" : "Delete"} "${goalToDelete.title}"?` : ""}
        confirmLabel={i18n.language === "fa" ? "حذف" : "Delete"}
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
