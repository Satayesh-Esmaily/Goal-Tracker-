import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { alpha } from "@mui/material/styles";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTranslation } from "react-i18next";
import SectionCard from "../common/SectionCard";

export default function CategoriesDonutChart({ categories }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const COLORS = [
    primary,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.secondary.main,
    theme.palette.info.main,
    theme.palette.error.main,
  ];
  const chartItems = categories.slice(0, 6);

  const chartData = chartItems.map((item, index) => ({
    id: index,
    value: Math.max(0, item.progressSum),
    label: item.name,
    color: COLORS[index % COLORS.length],
  }));

  const avgProgress =
    chartItems.length === 0
      ? 0
      : Math.round(
          chartItems.reduce((acc, item) => acc + item.progressRate, 0) /
            chartItems.length
        );
  const avgCompletion =
    chartItems.length === 0
      ? 0
      : Math.round(
          chartItems.reduce(
            (acc, item) =>
              acc + (item.total ? (item.completed / item.total) * 100 : 0),
            0
          ) / chartItems.length
        );
  const topCategory = chartItems[0];
  const lowestCategory = [...chartItems].sort(
    (a, b) => a.progressRate - b.progressRate
  )[0];

  return (
    <SectionCard
      title={t("categoriesPage.donut.progressShare")}
      action={
        <Chip
          size="small"
          icon={<InsightsRoundedIcon sx={{ fontSize: 16 }} />}
          label={t("categoriesPage.donut.insights")}
        />
      }
      sx={{
        height: "100%",
        width: "100%",
        borderColor: alpha(primary, 0.24),
        background: isDark
          ? `linear-gradient(180deg, ${alpha(
              theme.palette.background.paper,
              0.9
            )}, ${alpha(theme.palette.background.paper, 0.78)})`
          : `linear-gradient(180deg, ${alpha("#ffffff", 0.96)}, ${alpha(
              "#f8fafc",
              0.9
            )})`,
      }}
      contentSx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {chartItems.length === 0 ? (
        <Typography color="text.secondary">
          {t("categoriesPage.noDataYet")}
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "250px 1fr" },
            gap: 2,
            alignItems: { xs: "center", lg: "start" },
            minHeight: 330,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 250,
              height: 250,
              flexShrink: 0,
              mx: "auto",
              borderRadius: "50%",
              background: isDark
                ? `radial-gradient(circle, ${alpha(
                    primary,
                    0.16
                  )} 0%, rgba(15,23,42,0) 68%)`
                : `radial-gradient(circle, ${alpha(
                    primary,
                    0.12
                  )} 0%, rgba(248,250,252,0) 68%)`,
            }}
          >
            <PieChart
              height={250}
              width={250}
              hideLegend
              legend={{ hidden: true }}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              colors={chartData.map((item) => item.color)}
              series={[
                {
                  data: chartData,
                  innerRadius: 64,
                  outerRadius: 96,
                  paddingAngle: 1.5,
                  cornerRadius: 4,
                  startAngle: -90,
                  endAngle: 270,
                  cx: 125,
                  cy: 125,
                },
              ]}
            />
            <Stack
              spacing={0.15}
              alignItems="center"
              justifyContent="center"
              sx={{ position: "absolute", inset: 0 }}
            >
              <Typography variant="caption" color="text.secondary">
                {t("categoriesPage.donut.averageProgress")}
              </Typography>
              <Typography variant="h5" fontWeight={900}>
                {avgProgress}%
              </Typography>
            </Stack>
          </Box>

          <Stack spacing={1} sx={{ width: "100%", minWidth: 0 }}>
            {chartItems.map((item, index) => (
              <Stack
                key={item.name}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  px: 1.1,
                  py: 0.75,
                  borderRadius: 1.5,
                  bgcolor: isDark
                    ? "rgba(15,23,42,0.36)"
                    : "rgba(248,250,252,0.72)",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: isDark
                      ? "rgba(59,130,246,0.55)"
                      : "rgba(37,99,235,0.42)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: COLORS[index % COLORS.length],
                    }}
                  />
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ fontWeight: 600, minWidth: 0 }}
                  >
                    {item.name}
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  fontWeight={800}
                  sx={{ flexShrink: 0 }}
                >
                  {item.progressRate}%
                </Typography>
              </Stack>
            ))}

            <Box
              sx={{
                mt: 0.5,
                p: 1.25,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: isDark
                  ? alpha(theme.palette.background.paper, 0.42)
                  : alpha(theme.palette.background.paper, 0.84),
              }}
            >
              <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
                {t("categoriesPage.donut.quickInsights")}
              </Typography>
              <Stack spacing={0.8}>
                <Stack
                  direction="row"
                  spacing={0.8}
                  alignItems="center"
                  sx={{
                    p: 0.9,
                    borderRadius: 1.4,
                    border: "1px solid",
                    borderColor: alpha(theme.palette.success.main, 0.36),
                    bgcolor: alpha(
                      theme.palette.success.main,
                      isDark ? 0.16 : 0.14
                    ),
                  }}
                >
                  <WorkspacePremiumRoundedIcon
                    sx={{ fontSize: 17, color: theme.palette.success.main }}
                  />
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {topCategory?.name || "-"} ({topCategory?.progressRate || 0}
                    %)
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={0.8}
                  alignItems="center"
                  sx={{
                    p: 0.9,
                    borderRadius: 1.4,
                    border: "1px solid",
                    borderColor: alpha(theme.palette.warning.main, 0.38),
                    bgcolor: alpha(
                      theme.palette.warning.main,
                      isDark ? 0.17 : 0.14
                    ),
                  }}
                >
                  <WarningAmberRoundedIcon
                    sx={{ fontSize: 17, color: theme.palette.warning.main }}
                  />
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {lowestCategory?.name || "-"} (
                    {lowestCategory?.progressRate || 0}%)
                  </Typography>
                </Stack>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
                sx={{ mt: 1 }}
              >
                <Chip
                  size="small"
                  variant="outlined"
                  label={t("categoriesPage.donut.avgProgressChip", {
                    value: avgProgress,
                  })}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  size="small"
                  variant="outlined"
                  label={t("categoriesPage.donut.avgCompletedChip", {
                    value: avgCompletion,
                  })}
                  sx={{ fontWeight: 700 }}
                />
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </SectionCard>
  );
}
