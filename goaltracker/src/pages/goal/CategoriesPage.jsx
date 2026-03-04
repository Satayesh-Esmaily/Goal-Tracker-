import { useMemo, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import { useGoals } from "../../context/GoalsContext";
import { useTranslation } from "react-i18next";
import CategoriesDonutChart from "../../components/categories/CategoriesDonutChart";
import CategoriesProgressChart from "../../components/categories/CategoriesProgressChart";
import CategoriesCardsGrid from "../../components/categories/CategoriesCardsGrid";
import SectionCard from "../../components/common/SectionCard";

export default function CategoriesPage() {
  const { goals } = useGoals();
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState("progress");

  const categories = useMemo(() => {
    const map = new Map();

    goals.forEach((goal) => {
      const name = goal.category || "Uncategorized";
      const current = map.get(name) || {
        name,
        active: 0,
        completed: 0,
        paused: 0,
        total: 0,
        progressSum: 0,
        targetSum: 0,
      };

      const target = Math.max(1, Number(goal.target) || 1);
      const progress = Math.max(
        0,
        Math.min(target, Number(goal.progress) || 0)
      );

      current.total += 1;
      current.progressSum += progress;
      current.targetSum += target;
      if (goal.status === "completed") current.completed += 1;
      if (goal.status === "active") current.active += 1;
      if (goal.status === "paused") current.paused += 1;

      map.set(name, current);
    });

    return [...map.values()]
      .map((item) => {
        const progressRate =
          item.targetSum === 0
            ? 0
            : Math.round((item.progressSum / item.targetSum) * 100);

        const completionRate =
          item.total === 0
            ? 0
            : Math.round((item.completed / item.total) * 100);

        const healthScore = Math.round(
          progressRate * 0.6 + completionRate * 0.4
        );

        return {
          ...item,
          progressRate,
          completionRate,
          healthScore,
        };
      })
      .sort((a, b) => {
        if (sortBy === "health") return b.healthScore - a.healthScore;
        if (sortBy === "total") return b.total - a.total;
        if (sortBy === "completion") return b.completionRate - a.completionRate;
        return b.progressRate - a.progressRate;
      });
  }, [goals, sortBy]);

  const strongestCategory = categories[0];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack>
            <Typography variant="h4" fontWeight={800}>
              {t("categoriesPage.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("categoriesPage.subtitle")}
            </Typography>
          </Stack>

          <FormControl size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="progress">Progress %</MenuItem>
              <MenuItem value="completion">Completion Rate</MenuItem>
              <MenuItem value="health">Health Score</MenuItem>
              <MenuItem value="total">Total Goals</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Categories
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {categories.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Strongest Category
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {strongestCategory?.name || "-"}
                </Typography>
                {strongestCategory && (
                  <Chip
                    label={`Health Score: ${strongestCategory.healthScore}`}
                    color="success"
                    size="small"
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Goals
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {goals.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {categories.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: 2,
            }}
          >
            <CategoriesDonutChart categories={categories} />
            <CategoriesProgressChart categories={categories} />
          </Box>
        )}

        <SectionCard title="All Categories">
          <CategoriesCardsGrid categories={categories} />
        </SectionCard>

        {strongestCategory && (
          <Card sx={{ bgcolor: "background.default" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>
                📊 Insight
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your strongest focus is on{" "}
                <strong>{strongestCategory.name}</strong> with a health score of{" "}
                {strongestCategory.healthScore}. Keep building momentum 🚀
              </Typography>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Container>
  );
}
