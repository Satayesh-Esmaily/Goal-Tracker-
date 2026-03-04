import {
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Chip,
  Box,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoalForm from "../../components/goals/GoalForm";
import { useGoals } from "../../context/GoalsContext";

export default function EditGoalPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { goals, updateGoal, deleteGoal } = useGoals();
  const [openDelete, setOpenDelete] = useState(false);

  const goal = goals.find((item) => item.id === id);

  if (!goal) {
    return <Navigate to="/goals" replace />;
  }

  const progressRate = Math.round(
    (goal.progress / Math.max(1, goal.target)) * 100
  );

  const xpEarned = (goal.logs?.length || 0) * 20;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Typography variant="h4" fontWeight={800}>
          ✏️ Edit Goal
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
            gap: 3,
          }}
        >
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {progressRate}%
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={goal.status}
                  color={
                    goal.status === "completed"
                      ? "success"
                      : goal.status === "paused"
                      ? "warning"
                      : "primary"
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  XP Earned
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {xpEarned} XP
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Activity (Last 5)
                </Typography>
                {goal.logs
                  ?.slice(-5)
                  .reverse()
                  .map((log, index) => (
                    <Typography key={index} variant="body2">
                      {new Date(log.date).toLocaleDateString()} — +{log.amount}
                    </Typography>
                  ))}
              </CardContent>
            </Card>
          </Stack>

          <Card>
            <CardContent>
              <GoalForm
                initialData={goal}
                onSubmitGoal={(payload) => updateGoal(goal.id, payload)}
              />

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: "block" }}
              >
                {t("goalsPage.lastUpdated")}:{" "}
                {new Date(goal.updatedAt || goal.createdAt).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" color="error" fontWeight={700}>
                Danger Zone
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => setOpenDelete(true)}
                >
                  Delete Goal
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogTitle>Delete Goal?</DialogTitle>
          <DialogContent>This action cannot be undone.</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button
              color="error"
              onClick={() => {
                deleteGoal(goal.id);
                setOpenDelete(false);
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
}
