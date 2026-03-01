import { useMemo, useState } from "react";
import { Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGoals } from "../../context/GoalsContext";
import GoalsPageHeader from "../../components/goals/GoalsPageHeader";
import GoalsFilterTabs from "../../components/goals/GoalsFilterTabs";
import GoalsFiltersBar from "../../components/goals/GoalsFiltersBar";
import GoalsGrid from "../../components/goals/GoalsGrid";
import { sortAndFilterGoals } from "../../utils/goals";

export default function GoalsListPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const { goals, addProgress, togglePause, deleteGoal } = useGoals();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filteredGoals = useMemo(() => {
    return sortAndFilterGoals(goals, { tab, search, sortBy });
  }, [goals, tab, search, sortBy]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={isFa ? 5 : 3}>
        <GoalsPageHeader isFa={isFa} />

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
          onDelete={deleteGoal}
        />
      </Stack>
    </Container>
  );
}
