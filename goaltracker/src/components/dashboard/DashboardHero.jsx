import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SectionCard from "../common/SectionCard";
import ExportButton from "../common/ExportButton";
import { useGoals } from "../../context/GoalsContext";

export default function DashboardHero({
  totalGoals,
  completedCount,
  streak,
  isFa,
  isDark,
  userName,
}) {
  const { t } = useTranslation();
  const { goals } = useGoals();

  return (
    <SectionCard
      sx={{
        background: isDark
          ? "linear-gradient(120deg, rgba(25,118,210,0.32), rgba(15,23,42,0.88))"
          : "linear-gradient(120deg, rgba(25,118,210,0.14), rgba(255,255,255,1))",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
      >
        <Box>
          {userName && (
            <Typography
              variant="subtitle2"
              sx={{
                mb: 0.45,
                color: isDark
                  ? "rgba(191,219,254,0.92)"
                  : "rgba(30,64,175,0.86)",
                fontWeight: 700,
              }}
            >
              {t("dashboard.welcome", { name: userName })}
            </Typography>
          )}

          <Typography variant="h4" fontWeight={800}>
            {t("dashboard.title")}
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            {t("dashboard.subtitle")}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 1.5 }}
            useFlexGap
            flexWrap="wrap"
          >
            <Chip
              size="small"
              label={t("dashboard.totalGoals", { count: totalGoals })}
              sx={{
                borderRadius: 999,
                fontWeight: 700,
                bgcolor: "rgba(30,64,175,0.48)",
                color: "#dbeafe",
                border: "1px solid rgba(96,165,250,0.72)",
              }}
            />
            <Chip
              size="small"
              label={t("dashboard.completedChip", { count: completedCount })}
              sx={{
                borderRadius: 999,
                fontWeight: 700,
                bgcolor: "rgba(22,101,52,0.5)",
                color: "#bbf7d0",
                border: "1px solid rgba(34,197,94,0.78)",
              }}
            />
            <Chip
              size="small"
              label={t("dashboard.streakChip", { count: streak })}
              sx={{
                borderRadius: 999,
                fontWeight: 700,
                bgcolor: "rgba(146,64,14,0.52)",
                color: "#fde68a",
                border: "1px solid rgba(245,158,11,0.82)",
              }}
            />
          </Stack>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={isFa ? 2.75 : 1.25}
          gap={{ xs: 2, sm: isFa ? 3 : 2 }}
        >
          <Button
            variant="contained"
            component={RouterLink}
            to="/goals/new"
            startIcon={<AddRoundedIcon />}
            sx={{ px: isFa ? 2.75 : 2 }}
          >
            {t("dashboard.newGoal")}
          </Button>

          <Button
            variant="outlined"
            component={RouterLink}
            to="/goals"
            endIcon={<ArrowOutwardRoundedIcon />}
            sx={{ px: isFa ? 2.75 : 2 }}
          >
            {t("dashboard.manageGoals")}
          </Button>

          <ExportButton
            goals={goals}
            fileName="dashboard_goals.json"
            disabled={goals.length === 0}
          />
        </Stack>
      </Stack>
    </SectionCard>
  );
}
