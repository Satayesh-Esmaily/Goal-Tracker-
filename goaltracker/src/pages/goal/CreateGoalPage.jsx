import { Container } from "@mui/material";
import GoalForm from "../../components/goals/GoalForm";

const CreateGoalPage = () => {
  return (
    // Centered container for the goal creation form.
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Reuse GoalForm in create mode (no initial data). */}
      <GoalForm />
    </Container>
  );
};

export default CreateGoalPage;

