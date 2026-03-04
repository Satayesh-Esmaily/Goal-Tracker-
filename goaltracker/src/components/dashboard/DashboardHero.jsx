import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SectionCard from "../common/SectionCard";
import DownloadRoundIcon from "@mui/icons-material/DownloadRounded"

export default function DashboardHero({ totalGoals, completedCount, streak, isFa, isDark }) {
  const { t } = useTranslation();

  // تابع Export برای خروجی گرفتن JSON
  const handleExport = () => {
    const goals = JSON.parse(localStorage.getItem("goals") || "[]");
    const stats = JSON.parse(localStorage.getItem("stats") || "{}"); // اگر stats داشبورد ذخیره شده
    const exportData = { goals, stats };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "dashboard_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

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
        {/* بخش عنوان و چیپ‌ها */}
        <Box>
          <Typography variant="h4" fontWeight={800}>
            {t("dashboard.title")}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            {t("dashboard.subtitle")}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap">
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

        {/* دکمه‌ها */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={isFa ? 2.75 : 1.25} flexWrap="wrap">
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

          {/* دکمه Export JSON */}
          <Button
  variant="outlined"
  startIcon={<DownloadRoundedIcon />}
  onClick={handleExport}
  sx={{ px: isFa ? 2.75 : 2 }}
>
  {t("dashboard.export")}
</Button>
        </Stack>
        </Stack>
    </SectionCard>
  );
}