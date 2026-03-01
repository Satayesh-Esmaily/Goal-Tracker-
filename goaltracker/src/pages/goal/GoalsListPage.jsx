import { useMemo, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Grid,
  Button,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoalCard from "../../components/dashboard/GoalCard";
import { useGoals } from "../../context/GoalsContext";

export default function GoalsListPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const { goals, addProgress, togglePause, deleteGoal } = useGoals();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filteredGoals = useMemo(() => {
    const searched = goals.filter((goal) =>
      goal.title.toLowerCase().includes(search.trim().toLowerCase())
    );

    const tabFiltered =
      tab === "all" ? searched : searched.filter((goal) => goal.status === tab);

    const sorted = [...tabFiltered];
    sorted.sort((a, b) => {
      if (sortBy === "progress") {
        const aPercent = Math.round((a.progress / a.target) * 100);
        const bPercent = Math.round((b.progress / b.target) * 100);
        return bPercent - aPercent;
      }
      if (sortBy === "category") {
        return a.category.localeCompare(b.category);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [goals, tab, search, sortBy]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={isFa ? 5 : 3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={isFa ? 4 : 2}
          useFlexGap
          flexWrap="wrap"
        >
          <Typography variant="h4" fontWeight={700}>
            {t("goalsPage.title")}
          </Typography>
          <Button variant="contained" component={RouterLink} to="/goals/new">
            {t("goalsPage.newGoal")}
          </Button>
        </Stack>

        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable">
          <Tab label={t("goalsPage.tabs.all")} value="all" />
          <Tab label={t("goalsPage.tabs.active")} value="active" />
          <Tab label={t("goalsPage.tabs.completed")} value="completed" />
          <Tab label={t("goalsPage.tabs.paused")} value="paused" />
        </Tabs>

        <Stack direction={{ xs: "column", md: "row" }} spacing={isFa ? 4 : 2}>
          <TextField
            fullWidth
            label={t("goalsPage.searchByTitle")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <TextField
            select
            label={t("goalsPage.sortBy")}
            sx={{ minWidth: 220 }}
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <MenuItem value="newest">{t("goalsPage.newest")}</MenuItem>
            <MenuItem value="progress">{t("goalsPage.progress")}</MenuItem>
            <MenuItem value="category">{t("goalsPage.category")}</MenuItem>
          </TextField>
        </Stack>

        {filteredGoals.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 3 }}>
            <Typography color="text.secondary">{t("goalsPage.noGoalsFound")}</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredGoals.map((goal) => (
              <Grid item xs={12} md={6} key={goal.id}>
                <GoalCard
                  goal={goal}
                  onAddProgress={() => addProgress(goal.id, 1)}
                  onTogglePause={() => togglePause(goal.id)}
                  onEdit={() => navigate(`/goals/${goal.id}/edit`)}
                  onDelete={() => deleteGoal(goal.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
}
