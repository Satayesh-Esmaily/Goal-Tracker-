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
      contentSx={{ p: { xs: 2, sm: 2.5 } }}
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

          <Typography
            sx={{
              fontWeight: 800,
              lineHeight: 1.08,
              fontSize: { xs: "2.25rem", sm: "2.6rem", md: "2.9rem" },
              letterSpacing: "-0.01em",
            }}
          >
            {t("dashboard.title")}
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 620 }}>
            {t("dashboard.subtitle")}
          </Typography>

          <Stack
            direction="row"
            spacing={0.8}
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
                height: { xs: 26, sm: 28 },
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
                height: { xs: 26, sm: 28 },
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
                height: { xs: 26, sm: 28 },
                bgcolor: "rgba(146,64,14,0.52)",
                color: "#fde68a",
                border: "1px solid rgba(245,158,11,0.82)",
              }}
            />
          </Stack>
        </Box>

        <Stack
          sx={{
            width: { xs: "100%", md: "auto" },
            maxWidth: { xs: 420, md: "none" },
          }}
          spacing={1.1}
        >
          <Button
            variant="contained"
            component={RouterLink}
            to="/goals/new"
            startIcon={<AddRoundedIcon />}
            sx={{
              px: isFa ? 2.75 : 2,
              width: { xs: "100%", sm: "auto" },
              minHeight: 44,
              gap: isFa ? 0.45 : 0.7,
              "& .MuiButton-startIcon": isFa
                ? { marginLeft: 0.35, marginRight: 0 }
                : undefined,
            }}
          >
            {t("dashboard.newGoal")}
          </Button>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1.1,
            }}
          >
            <Button
              variant="outlined"
              component={RouterLink}
              to="/goals"
              endIcon={<ArrowOutwardRoundedIcon />}
              sx={{
                px: isFa ? 2.75 : 2,
                minHeight: 44,
                gap: isFa ? 0.45 : 0.7,
                "& .MuiButton-endIcon": isFa
                  ? { marginRight: 0.35, marginLeft: 0 }
                  : undefined,
              }}
            >
              {t("dashboard.manageGoals")}
            </Button>

            <ExportButton
              goals={goals}
              fileName="dashboard_goals.json"
              disabled={goals.length === 0}
              sx={{
                gap: isFa ? 0.45 : 0.7,
                "& .MuiButton-startIcon": isFa
                  ? { marginLeft: 0.35, marginRight: 0 }
                  : undefined,
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </SectionCard>
  );
}
