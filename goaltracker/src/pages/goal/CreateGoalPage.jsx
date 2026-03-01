import { Container } from "@mui/material";
import GoalForm from "../../components/goals/GoalForm";

const CreateGoalPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <GoalForm />
    </Container>
  );
};

export default CreateGoalPage;
