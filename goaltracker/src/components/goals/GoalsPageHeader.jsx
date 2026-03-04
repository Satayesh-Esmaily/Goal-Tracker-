import { Button, Card, CardContent, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function GoalsPageHeader() {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: alpha(primary, 0.35),
        borderRadius: 3.2,
        background: isDark
          ? `linear-gradient(120deg, ${alpha(primary, 0.24)}, ${alpha(theme.palette.background.paper, 0.9)})`
          : `linear-gradient(120deg, ${alpha(primary, 0.12)}, ${alpha("#ffffff", 0.94)})`,
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={isFa ? 2.75 : 2}
          useFlexGap
          flexWrap="wrap"
        >
          <Stack spacing={0.5}>
            <Typography variant="h4" fontWeight={900}>
              {t("goalsPage.title")}
            </Typography>
            <Typography color="text.secondary">{t("goalsPage.subtitle")}</Typography>
          </Stack>
          <Button variant="contained" component={RouterLink} to="/goals/new" sx={{ borderRadius: 999, px: 2.25 }}>
            {t("goalsPage.newGoal")}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
