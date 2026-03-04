import { useState } from "react";
import {
  Container,
  Stack,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import GoalForm from "../../components/goals/GoalForm";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const CreateGoalPage = () => {
  const [previewData, setPreviewData] = useState(null);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            🎯 Create New Goal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Define your next milestone and start building momentum.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Card elevation={3}>
            <CardContent>
              <GoalForm onPreviewChange={setPreviewData} />
            </CardContent>
          </Card>

          <Stack spacing={2}>
            <Card
              sx={{
                borderRadius: 3,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "white",
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                  Live Preview
                </Typography>

                <Typography variant="h6" fontWeight={700}>
                  {previewData?.title || "Your goal title"}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  Target: {previewData?.target || 0}
                </Typography>

                <Chip
                  icon={<TrendingUpIcon />}
                  label="Estimated XP: +100"
                  sx={{
                    mt: 2,
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700}>
                  💡 Smart Tips
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  • Break big goals into smaller milestones.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Daily goals improve streak consistency.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Specific targets increase completion rate by 42%.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default CreateGoalPage;
