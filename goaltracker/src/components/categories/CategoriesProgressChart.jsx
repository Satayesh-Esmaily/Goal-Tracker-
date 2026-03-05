import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import { alpha } from "@mui/material/styles";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTranslation } from "react-i18next";
import SectionCard from "../common/SectionCard";

function shortLabel(text, max = 12) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}...`;
}

export default function CategoriesProgressChart({ categories }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  const chartItems = categories.slice(0, 7);
  const labels = chartItems.map((item) => shortLabel(item.name));
  const progressSeries = chartItems.map((item) => item.progressRate);
  const completeSeries = chartItems.map((item) =>
    item.total === 0 ? 0 : Math.round((item.completed / item.total) * 100)
  );
  const chartHeight = Math.max(300, chartItems.length * 42 + 88);

  const topCategory = chartItems[0];
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

  return (
    <SectionCard
      title={t("categoriesPage.progressChart.categoryComparison")}
      action={
        <Chip
          size="small"
          icon={<AutoGraphRoundedIcon sx={{ fontSize: 16 }} />}
          label={t("categoriesPage.progressChart.analytics")}
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
        <Stack spacing={1.15} sx={{ minHeight: 330, flex: 1 }}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              size="small"
              label={t("categoriesPage.progressChart.topChip", {
                name: topCategory?.name || "-",
                value: topCategory?.progressRate || 0,
              })}
              sx={{ fontWeight: 700, borderRadius: 1.5 }}
            />
            <Chip
              size="small"
              variant="outlined"
              label={t("categoriesPage.progressChart.avgProgressChip", {
                value: avgProgress,
              })}
              sx={{ fontWeight: 700, borderRadius: 1.5 }}
            />
            <Chip
              size="small"
              variant="outlined"
              label={t("categoriesPage.progressChart.avgCompletedChip", {
                value: avgCompletion,
              })}
              sx={{ fontWeight: 700, borderRadius: 1.5 }}
            />
          </Stack>

          <Box
            sx={{
              borderRadius: 2.25,
              p: { xs: 0.75, md: 1.2 },
              bgcolor: isDark
                ? alpha(theme.palette.background.paper, 0.35)
                : alpha(theme.palette.background.paper, 0.84),
              flex: 1,
              border: "1px solid",
              borderColor: alpha(primary, 0.24),
              minHeight: 320,
              width: "100%",
              maxWidth: 560,
              mx: "auto",
              boxShadow: isDark
                ? "0 10px 24px rgba(2,8,23,0.32)"
                : "0 8px 20px rgba(15,23,42,0.08)",
            }}
          >
            <BarChart
              layout="horizontal"
              height={chartHeight}
              yAxis={[{ scaleType: "band", data: labels }]}
              xAxis={[{ min: 0, max: 100 }]}
              margin={{ top: 18, right: 22, bottom: 20, left: 120 }}
              series={[
                {
                  data: progressSeries,
                  label: t("categoriesPage.progressChart.progressPercent"),
                  color: primary,
                  borderRadius: 6,
                },
                {
                  data: completeSeries,
                  label: t("categoriesPage.progressChart.completedPercent"),
                  color: theme.palette.success.main,
                  borderRadius: 6,
                },
              ]}
              grid={{ horizontal: true }}
              slotProps={{
                legend: {
                  direction: "row",
                  position: { vertical: "top", horizontal: "middle" },
                  itemMarkWidth: 12,
                  itemMarkHeight: 12,
                  markGap: 6,
                  itemGap: 16,
                },
              }}
            />
          </Box>
        </Stack>
      )}
    </SectionCard>
  );
}
