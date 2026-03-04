import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function GoalspageHero() {
  const { t } = useTranslation();

  return (
    <Card elevation={0} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={0.75}>
          <Typography variant="h4" fontWeight={900}>
            {t("goalsPage.title")}
          </Typography>
          <Typography color="text.secondary">
            {t(
              "goalsPage.subtitle",
              "Track and manage your goals efficiently."
            )}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default GoalspageHero;
