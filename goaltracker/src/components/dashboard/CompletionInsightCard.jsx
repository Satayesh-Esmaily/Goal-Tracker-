import {
  Box,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import SectionCard from "../common/SectionCard";

export default function CompletionInsightCard({
  completedCount,
  totalGoals,
  percent,
}) {
  const { t } = useTranslation();

  return (
    <SectionCard title={t("dashboard.completionInsight")}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={percent}
            size={92}
            thickness={4.8}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" fontWeight={800}>
              {percent}%
            </Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t("dashboard.completedFrom", {
              completed: completedCount,
              total: totalGoals,
            })}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{
              mt: 1,
              height: 8,
              borderRadius: 999,
              bgcolor: "action.hover",
            }}
          />
        </Box>
      </Stack>
    </SectionCard>
  );
}
