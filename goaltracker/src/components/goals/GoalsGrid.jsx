import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import GoalCard from "../dashboard/GoalCard";

export default function GoalsGrid({ goals, onAddProgress, onTogglePause, onEdit, onDelete }) {
  const { t } = useTranslation();

  if (goals.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 3 }}>
        <Typography color="text.secondary">{t("goalsPage.noGoalsFound")}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {goals.map((goal) => (
        <Grid item xs={12} md={6} key={goal.id}>
          <GoalCard
            goal={goal}
            onAddProgress={() => onAddProgress(goal.id)}
            onTogglePause={() => onTogglePause(goal.id)}
            onEdit={() => onEdit(goal.id)}
            onDelete={() => onDelete(goal.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
