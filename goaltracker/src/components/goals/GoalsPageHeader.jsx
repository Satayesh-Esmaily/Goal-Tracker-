import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function GoalsPageHeader({ isFa }) {
  const { t } = useTranslation();

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      spacing={isFa ? 4 : 2}
      useFlexGap
      flexWrap="wrap"
    >
      <Typography variant="h4" fontWeight={700}>
        {t("goalsPage.title")}
      </Typography>
      <Button variant="contained" component={RouterLink} to="/goals/new">
        {t("goalsPage.newGoal")}
      </Button>
    </Stack>
  );
}
