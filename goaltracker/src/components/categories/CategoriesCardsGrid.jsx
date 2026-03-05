import { useMemo, useState } from "react";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import FlagCircleOutlinedIcon from "@mui/icons-material/FlagCircleOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  alpha,
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
    progressPercent >= 70
      ? theme.palette.success.main
      : progressPercent >= 40
      ? theme.palette.primary.main
      : theme.palette.warning.main;

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
          ? `linear-gradient(180deg, ${alpha(
              theme.palette.background.paper,
              0.95
            )}, ${alpha(theme.palette.background.paper, 0.75)})`
          : "linear-gradient(180deg, rgba(255,255,255,1), rgba(248,250,252,0.9))",
        boxShadow: isDark
          ? "0 12px 28px rgba(2,6,23,0.32)"
          : "0 8px 20px rgba(15,23,42,0.08)",
        transition: "transform 180ms ease, border-color 180ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: alpha(theme.palette.primary.main, 0.5),
        },
      }}
    >
      <Box sx={{ height: 4, width: "100%", bgcolor: barColor }} />
      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={1.35}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                label={`#${index + 1}`}
                sx={{ fontWeight: 700 }}
              />
              <Typography variant="h6" fontWeight={800}>
                {category.name}
              </Typography>
            </Stack>
            <Chip
              size="small"
              label={t("categoriesPage.cards.goalsCount", {
                count: category.total,
              })}
              color="primary"
              variant="outlined"
            />
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
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 0.55 }}
            >
              <Stack direction="row" spacing={0.75} alignItems="center">
                <AutoGraphRoundedIcon sx={{ fontSize: 18, color: barColor }} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 700 }}
                >
                  {t("categoriesPage.cards.progress")}
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
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.7, display: "block" }}
            >
              {t("categoriesPage.cards.trackedUnits", {
                progress: Math.round(category.progressSum),
                target: Math.round(category.targetSum),
              })}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

const SORT_OPTIONS = [
  { value: "progress_desc", key: "categoriesPage.sort.progressDesc" },
  { value: "progress_asc", key: "categoriesPage.sort.progressAsc" },
  { value: "goals_desc", key: "categoriesPage.sort.goalsDesc" },
  { value: "name_asc", key: "categoriesPage.sort.nameAsc" },
];

export default function CategoriesCardsGrid({ categories }) {
  const { t } = useTranslation();
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
      attention: categories.filter((category) => category.progressRate < 40)
        .length,
    }),
    [categories]
  );

  const filteredCategories = useMemo(() => {
    let result = categories;

    if (filter === "active")
      result = result.filter((category) => category.active > 0);
    if (filter === "completed")
      result = result.filter((category) => category.completed > 0);
    if (filter === "attention")
      result = result.filter((category) => category.progressRate < 40);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((category) =>
        category.name.toLowerCase().includes(q)
      );
    }

    const sorted = [...result];
    if (sortBy === "progress_desc")
      sorted.sort((a, b) => b.progressRate - a.progressRate);
    if (sortBy === "progress_asc")
      sorted.sort((a, b) => a.progressRate - b.progressRate);
    if (sortBy === "goals_desc") sorted.sort((a, b) => b.total - a.total);
    if (sortBy === "name_asc")
      sorted.sort((a, b) => a.name.localeCompare(b.name));

    return sorted;
  }, [categories, filter, query, sortBy]);

  const filterPills = [
    { key: "all", label: t("categoriesPage.filters.all"), icon: null },
    {
      key: "active",
      label: t("categoriesPage.filters.active"),
      icon: <FlagCircleOutlinedIcon sx={{ fontSize: 16 }} />,
    },
    {
      key: "completed",
      label: t("categoriesPage.filters.completed"),
      icon: <TaskAltRoundedIcon sx={{ fontSize: 16 }} />,
    },
    {
      key: "attention",
      label: t("categoriesPage.filters.attention"),
      icon: <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />,
    },
  ];

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          p: 1.25,
          borderRadius: 2,
          border: "1px solid",
          borderColor: alpha(theme.palette.primary.main, 0.22),
          bgcolor: isDark
            ? alpha(theme.palette.background.paper, 0.5)
            : alpha(theme.palette.background.paper, 0.86),
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
              placeholder={t("categoriesPage.searchPlaceholder")}
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
                  {t(option.key)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
      </Box>

      <Typography variant="body2" color="text.secondary">
        {t("categoriesPage.showingCount", {
          shown: filteredCategories.length,
          total: categories.length,
        })}
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
