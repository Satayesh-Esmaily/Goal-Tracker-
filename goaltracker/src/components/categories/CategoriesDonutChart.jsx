import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import SectionCard from "../common/SectionCard";

const COLORS = ["#1976d2", "#2e7d32", "#ed6c02", "#7b1fa2", "#0288d1", "#d81b60"];

export default function CategoriesDonutChart({ categories }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
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
      : Math.round(chartItems.reduce((acc, item) => acc + item.progressRate, 0) / chartItems.length);
  const avgCompletion =
    chartItems.length === 0
      ? 0
      : Math.round(
          chartItems.reduce((acc, item) => acc + (item.total ? (item.completed / item.total) * 100 : 0), 0) /
            chartItems.length
        );
  const topCategory = chartItems[0];
  const lowestCategory = [...chartItems].sort((a, b) => a.progressRate - b.progressRate)[0];

  return (
    <SectionCard
      title="Progress Share"
      action={<Chip size="small" icon={<InsightsRoundedIcon sx={{ fontSize: 16 }} />} label="Insights" />}
      sx={{ height: "100%", width: "100%" }}
      contentSx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {chartItems.length === 0 ? (
        <Typography color="text.secondary">No category data yet.</Typography>
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
                ? "radial-gradient(circle, rgba(37,99,235,0.16) 0%, rgba(15,23,42,0) 68%)"
                : "radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(248,250,252,0) 68%)",
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
                Average Progress
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
                  bgcolor: isDark ? "rgba(15,23,42,0.36)" : "rgba(248,250,252,0.72)",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: isDark ? "rgba(59,130,246,0.55)" : "rgba(37,99,235,0.42)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: COLORS[index % COLORS.length] }} />
                  <Typography variant="body2" noWrap sx={{ fontWeight: 600, minWidth: 0 }}>
                    {item.name}
                  </Typography>
                </Stack>
                <Typography variant="body2" fontWeight={800} sx={{ flexShrink: 0 }}>
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
                bgcolor: isDark ? "rgba(15,23,42,0.3)" : "rgba(248,250,252,0.68)",
              }}
            >
              <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
                Quick Insights
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
                    borderColor: isDark ? "rgba(34,197,94,0.34)" : "rgba(22,163,74,0.28)",
                    bgcolor: isDark ? "rgba(22,101,52,0.16)" : "rgba(220,252,231,0.75)",
                  }}
                >
                  <WorkspacePremiumRoundedIcon sx={{ fontSize: 17, color: "#2e7d32" }} />
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {topCategory?.name || "-"} ({topCategory?.progressRate || 0}%)
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
                    borderColor: isDark ? "rgba(245,158,11,0.35)" : "rgba(217,119,6,0.3)",
                    bgcolor: isDark ? "rgba(146,64,14,0.17)" : "rgba(255,237,213,0.78)",
                  }}
                >
                  <WarningAmberRoundedIcon sx={{ fontSize: 17, color: "#ed6c02" }} />
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {lowestCategory?.name || "-"} ({lowestCategory?.progressRate || 0}%)
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                <Chip
                  size="small"
                  variant="outlined"
                  label={`Avg Progress ${avgProgress}%`}
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  size="small"
                  variant="outlined"
                  label={`Avg Completed ${avgCompletion}%`}
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
