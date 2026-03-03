import { useMemo, useState } from "react";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import FlagCircleOutlinedIcon from "@mui/icons-material/FlagCircleOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function CategoryCard({ category, index }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const progressPercent = category.progressRate;
  const barColor =
    progressPercent >= 70 ? "#2e7d32" : progressPercent >= 40 ? "#1976d2" : "#ed6c02";

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        overflow: "hidden",
        background: isDark
          ? "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(15,23,42,0.75))"
          : "linear-gradient(180deg, rgba(255,255,255,1), rgba(248,250,252,0.9))",
      }}
    >
      <Box sx={{ height: 4, width: "100%", bgcolor: barColor }} />
      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={1.35}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" label={`#${index + 1}`} sx={{ fontWeight: 700 }} />
              <Typography variant="h6" fontWeight={800}>
                {category.name}
              </Typography>
            </Stack>
            <Chip size="small" label={`${category.total} goals`} color="primary" variant="outlined" />
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              size="small"
              color="warning"
              variant="outlined"
              icon={<FlagCircleOutlinedIcon sx={{ fontSize: 16 }} />}
              label={`${t("categoriesPage.active")}: ${category.active}`}
            />
            <Chip
              size="small"
              color="success"
              variant="outlined"
              icon={<TaskAltRoundedIcon sx={{ fontSize: 16 }} />}
              label={`${t("categoriesPage.completed")}: ${category.completed}`}
            />
          </Stack>

          <Divider />

          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.55 }}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <AutoGraphRoundedIcon sx={{ fontSize: 18, color: barColor }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Progress
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ fontWeight: 800 }}>
                {progressPercent}%
              </Typography>
            </Stack>
            <LinearProgress
              value={progressPercent}
              variant="determinate"
              sx={{
                height: 10,
                borderRadius: 999,
                bgcolor: "action.hover",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  bgcolor: barColor,
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.7, display: "block" }}>
              {Math.round(category.progressSum)} / {Math.round(category.targetSum)} tracked units
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

const SORT_OPTIONS = [
  { value: "progress_desc", label: "Progress: High to Low" },
  { value: "progress_asc", label: "Progress: Low to High" },
  { value: "goals_desc", label: "Goals: Most First" },
  { value: "name_asc", label: "Name: A-Z" },
];

export default function CategoriesCardsGrid({ categories }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("progress_desc");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const filterCounts = useMemo(
    () => ({
      all: categories.length,
      active: categories.filter((category) => category.active > 0).length,
      completed: categories.filter((category) => category.completed > 0).length,
      attention: categories.filter((category) => category.progressRate < 40).length,
    }),
    [categories]
  );

  const filteredCategories = useMemo(() => {
    let result = categories;

    if (filter === "active") result = result.filter((category) => category.active > 0);
    if (filter === "completed") result = result.filter((category) => category.completed > 0);
    if (filter === "attention") result = result.filter((category) => category.progressRate < 40);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((category) => category.name.toLowerCase().includes(q));
    }

    const sorted = [...result];
    if (sortBy === "progress_desc") sorted.sort((a, b) => b.progressRate - a.progressRate);
    if (sortBy === "progress_asc") sorted.sort((a, b) => a.progressRate - b.progressRate);
    if (sortBy === "goals_desc") sorted.sort((a, b) => b.total - a.total);
    if (sortBy === "name_asc") sorted.sort((a, b) => a.name.localeCompare(b.name));

    return sorted;
  }, [categories, filter, query, sortBy]);

  const filterPills = [
    { key: "all", label: "All", icon: null },
    { key: "active", label: "Active", icon: <FlagCircleOutlinedIcon sx={{ fontSize: 16 }} /> },
    { key: "completed", label: "Completed", icon: <TaskAltRoundedIcon sx={{ fontSize: 16 }} /> },
    { key: "attention", label: "Needs Attention", icon: <WarningAmberRoundedIcon sx={{ fontSize: 16 }} /> },
  ];

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          p: 1.25,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: isDark ? "rgba(15,23,42,0.48)" : "rgba(248,250,252,0.85)",
        }}
      >
        <Stack spacing={1.1}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {filterPills.map((pill) => {
              const selected = filter === pill.key;
              return (
                <Chip
                  key={pill.key}
                  clickable
                  icon={pill.icon}
                  label={`${pill.label} (${filterCounts[pill.key]})`}
                  onClick={() => setFilter(pill.key)}
                  color={selected ? "primary" : "default"}
                  variant={selected ? "filled" : "outlined"}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                />
              );
            })}
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={1.1}>
            <TextField
              size="small"
              fullWidth
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search categories..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              size="small"
              select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              sx={{ minWidth: { xs: "100%", md: 220 } }}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
      </Box>

      <Typography variant="body2" color="text.secondary">
        Showing {filteredCategories.length} of {categories.length} categories
      </Typography>

      <Grid container spacing={2}>
        {filteredCategories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} key={category.name}>
            <CategoryCard category={category} index={index} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
