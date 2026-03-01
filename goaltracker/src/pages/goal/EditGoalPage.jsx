import { Container, Typography } from "@mui/material";
import { Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoalForm from "../../components/goals/GoalForm";
import { useGoals } from "../../context/GoalsContext";

export default function EditGoalPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { goals, updateGoal } = useGoals();
  const goal = goals.find((item) => item.id === id);

  if (!goal) {
    return <Navigate to="/goals" replace />;
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <GoalForm
        initialData={goal}
        onSubmitGoal={(payload) => updateGoal(goal.id, payload)}
      />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
        {t("goalsPage.lastUpdated")}: {new Date(goal.updatedAt || goal.createdAt).toLocaleString()}
      </Typography>
    </Container>
  );
}
