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
import { useTranslation } from "react-i18next";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GoalForm from "../../components/goals/GoalForm";

const CreateGoalPage = () => {
  const [previewData, setPreviewData] = useState(null);
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={800}>
            {t("createGoalPage.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("createGoalPage.subtitle")}
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
                  {t("createGoalPage.livePreview")}
                </Typography>

                <Typography variant="h6" fontWeight={700}>
                  {previewData?.title || t("createGoalPage.yourGoalTitle")}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  {t("createGoalPage.target")}: {previewData?.target || 0}
                </Typography>

                <Chip
                  icon={<TrendingUpIcon />}
                  label={t("createGoalPage.estimatedXp")}
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
                  {t("createGoalPage.smartTips")}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {t("createGoalPage.tip1")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("createGoalPage.tip2")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("createGoalPage.tip3")}
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
