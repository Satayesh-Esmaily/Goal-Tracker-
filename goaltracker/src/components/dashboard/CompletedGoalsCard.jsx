import { Chip, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import SectionCard from "../common/SectionCard";

export default function CompletedGoalsCard({ goals }) {
  const { t } = useTranslation();

  return (
    <SectionCard title={t("dashboard.completedPreview")}>
      {goals.length === 0 ? (
        <Typography color="text.secondary">
          {t("dashboard.noCompleted")}
        </Typography>
      ) : (
        <Stack spacing={1}>
          {goals.map((goal) => (
            <Stack
              key={goal.id}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2">{goal.title}</Typography>
              <Chip size="small" label={t("common.done")} color="success" />
            </Stack>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
