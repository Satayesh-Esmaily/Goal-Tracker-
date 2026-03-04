import { useMemo } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useGoals } from "../../context/GoalsContext";
import { useTranslation } from "react-i18next";
import CategoriesDonutChart from "../../components/categories/CategoriesDonutChart";
import CategoriesProgressChart from "../../components/categories/CategoriesProgressChart";
import CategoriesCardsGrid from "../../components/categories/CategoriesCardsGrid";
import SectionCard from "../../components/common/SectionCard";

export default function CategoriesPage() {
  const { goals } = useGoals();
  const { t } = useTranslation();

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
      const progress = Math.max(0, Math.min(target, Number(goal.progress) || 0));

      current.total += 1;
      current.progressSum += progress;
      current.targetSum += target;
      if (goal.status === "completed") current.completed += 1;
      if (goal.status === "active") current.active += 1;
      if (goal.status === "paused") current.paused += 1;

      map.set(name, current);
    });

    return [...map.values()]
      .map((item) => ({
        ...item,
        progressRate: item.targetSum === 0 ? 0 : Math.round((item.progressSum / item.targetSum) * 100),
      }))
      .sort((a, b) => b.progressRate - a.progressRate || b.total - a.total);
  }, [goals]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
          <Stack spacing={0.5}>
            <Typography variant="h4" fontWeight={800}>
              {t("categoriesPage.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("categoriesPage.subtitle")}
            </Typography>
          </Stack>
        </Stack>

        {categories.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 3 }}>
            <Typography color="text.secondary">{t("categoriesPage.noCategories")}</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                gap: 2,
                alignItems: "stretch",
              }}
            >
              <Box sx={{ minWidth: 0, display: "flex" }}>
                <CategoriesDonutChart categories={categories} />
              </Box>
              <Box sx={{ minWidth: 0, display: "flex" }}>
                <CategoriesProgressChart categories={categories} />
              </Box>
            </Box>

            <SectionCard title={t("categoriesPage.allCategories")}>
              <CategoriesCardsGrid categories={categories} />
            </SectionCard>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
