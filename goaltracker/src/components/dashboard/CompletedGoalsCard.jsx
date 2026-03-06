import { Button, Chip, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import SectionCard from "../common/SectionCard";

export default function CompletedGoalsCard({ goals }) {
  const { t } = useTranslation();

  return (
    <SectionCard
      title={t("dashboard.completedPreview")}
      action={
        <Button
          component={RouterLink}
          to="/archive"
          size="small"
          variant="text"
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 999 }}
        >
          {t("dashboard.openArchive")}
        </Button>
      }
    >
      {goals.length === 0 ? (
        <Typography color="text.secondary">
          {t("dashboard.noCompleted")}
        </Typography>
      ) : (
        <Stack spacing={1}>
          {goals.map((goal) => (
            <Stack
              key={goal.id}
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={0.75}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">{goal.title}</Typography>
                <Chip size="small" label={t("common.done")} color="success" />
              </Stack>
              <Button
                component={RouterLink}
                to="/archive"
                size="small"
                variant="outlined"
                sx={{ textTransform: "none", fontWeight: 700, borderRadius: 999 }}
              >
                {t("dashboard.openInArchive")}
              </Button>
            </Stack>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
