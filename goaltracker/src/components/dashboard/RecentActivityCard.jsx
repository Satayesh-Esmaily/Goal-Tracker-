import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { useTranslation } from "react-i18next";
import SectionCard from "../common/SectionCard";

export default function RecentActivityCard({ recentLogs }) {
  const { t } = useTranslation();

  return (
    <SectionCard
      title={t("dashboard.recentActivity")}
      action={
        <Chip
          size="small"
          icon={<InsightsRoundedIcon fontSize="small" />}
          label={t("dashboard.logsCount", { count: recentLogs.length })}
        />
      }
    >
      {recentLogs.length === 0 ? (
        <Typography color="text.secondary">
          {t("dashboard.noActivity")}
        </Typography>
      ) : (
        <Stack spacing={1}>
          {recentLogs.map((log, index) => (
            <Box key={log.id}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2">
                  {t("dashboard.activityItem", {
                    amount: log.amount,
                    title: log.title,
                  })}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {log.date.toLocaleDateString()}
                </Typography>
              </Stack>
              {index < recentLogs.length - 1 && <Divider sx={{ mt: 1 }} />}
            </Box>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
