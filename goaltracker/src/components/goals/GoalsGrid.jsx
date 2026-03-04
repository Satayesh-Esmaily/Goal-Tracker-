import { Grid } from "@mui/material";
import GoalCard from "../dashboard/GoalCard";
import EmptyState from "../common/EmptyState";

export default function GoalsGrid({
  goals,
  onAddProgress,
  onTogglePause,
  onEdit,
  onDelete,
}) {
  if (!Array.isArray(goals) || goals.length === 0) {
    return <EmptyState message="No goals found" />;
  }

  return (
    <Grid container spacing={2}>
      {goals.map((goal, index) => (
        <Grid item xs={12} md={6} key={goal.id || index}>
          <GoalCard
            goal={goal || {}}
            onAddProgress={() => onAddProgress && onAddProgress(goal?.id)}
            onTogglePause={() => onTogglePause && onTogglePause(goal?.id)}
            onEdit={() => onEdit && onEdit(goal?.id)}
            onDelete={() => onDelete && onDelete(goal?.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
