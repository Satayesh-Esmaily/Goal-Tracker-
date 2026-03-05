import { Chip, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import GoalCard from "./GoalCard";
import SectionCard from "../common/SectionCard";

export default function ActiveGoalsSection({
  goals,
  onAddProgress,
  onTogglePause,
  onDelete,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <SectionCard
      title={t("dashboard.activeGoals")}
      action={
        <Chip
          size="small"
          label={t("dashboard.itemsCount", { count: goals.length })}
        />
      }
    >
      {goals.length === 0 ? (
        <Typography color="text.secondary">
          {t("dashboard.noActiveGoals")}
        </Typography>
      ) : (
        <Grid container spacing={1.75}>
          {goals.slice(0, 6).map((goal) => (
            <Grid
              size={{ xs: 12, md: 6 }}
              key={goal.id}
              sx={{ display: "flex" }}
            >
              <GoalCard
                goal={goal}
                onAddProgress={() => onAddProgress(goal.id, 1)}
                onTogglePause={() => onTogglePause(goal.id)}
                onEdit={() => navigate(`/goals/${goal.id}/edit`)}
                onDelete={() => onDelete(goal)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </SectionCard>
  );
}
