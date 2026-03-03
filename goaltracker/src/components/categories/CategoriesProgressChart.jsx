import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import SectionCard from "../common/SectionCard";

function shortLabel(text, max = 12) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}...`;
}

export default function CategoriesProgressChart({ categories }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
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
      : Math.round(chartItems.reduce((acc, item) => acc + item.progressRate, 0) / chartItems.length);
  const avgCompletion =
    chartItems.length === 0
      ? 0
      : Math.round(
          chartItems.reduce((acc, item) => acc + (item.total ? (item.completed / item.total) * 100 : 0), 0) /
            chartItems.length
        );

  return (
    <SectionCard
      title="Category Comparison"
      action={<Chip size="small" icon={<AutoGraphRoundedIcon sx={{ fontSize: 16 }} />} label="Analytics" />}
      sx={{ height: "100%", width: "100%" }}
      contentSx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {chartItems.length === 0 ? (
        <Typography color="text.secondary">No category data yet.</Typography>
      ) : (
        <Stack spacing={1.15} sx={{ minHeight: 330, flex: 1 }}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              size="small"
              label={`Top: ${topCategory?.name || "-"} (${topCategory?.progressRate || 0}%)`}
              sx={{ fontWeight: 700, borderRadius: 1.5 }}
            />
            <Chip
              size="small"
              variant="outlined"
              label={`Avg Progress: ${avgProgress}%`}
              sx={{ fontWeight: 700, borderRadius: 1.5 }}
            />
            <Chip
              size="small"
              variant="outlined"
              label={`Avg Completed: ${avgCompletion}%`}
              sx={{ fontWeight: 700, borderRadius: 1.5 }}
            />
          </Stack>

          <Box
            sx={{
              borderRadius: 2.25,
              p: { xs: 0.75, md: 1.2 },
              bgcolor: isDark ? "rgba(15,23,42,0.28)" : "rgba(248,250,252,0.66)",
              flex: 1,
              border: "1px solid",
              borderColor: "divider",
              minHeight: 320,
              width: "100%",
              maxWidth: 560,
              mx: "auto",
              boxShadow: isDark ? "0 10px 24px rgba(2,8,23,0.32)" : "0 8px 20px rgba(15,23,42,0.08)",
            }}
          >
            <BarChart
              layout="horizontal"
              height={chartHeight}
              yAxis={[{ scaleType: "band", data: labels }]}
              xAxis={[{ min: 0, max: 100 }]}
              margin={{ top: 18, right: 22, bottom: 20, left: 120 }}
              series={[
                { data: progressSeries, label: "Progress %", color: "#1976d2", borderRadius: 6 },
                { data: completeSeries, label: "Completed %", color: "#2e7d32", borderRadius: 6 },
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
