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
import GoalCard from "../../components/dashboard/GoalCard";
import { useGoals } from "../../context/GoalsContext";

export default function GoalsListPage() {
  const navigate = useNavigate();
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
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
          <Typography variant="h4" fontWeight={700}>
            All Goals
          </Typography>
          <Button variant="contained" component={RouterLink} to="/goals/new">
            + New Goal
          </Button>
        </Stack>

        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable">
          <Tab label="All" value="all" />
          <Tab label="Active" value="active" />
          <Tab label="Completed" value="completed" />
          <Tab label="Paused" value="paused" />
        </Tabs>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="Search by title"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <TextField
            select
            label="Sort by"
            sx={{ minWidth: 220 }}
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="progress">Progress %</MenuItem>
            <MenuItem value="category">Category</MenuItem>
          </TextField>
        </Stack>

        {filteredGoals.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 3 }}>
            <Typography color="text.secondary">No goals found.</Typography>
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
