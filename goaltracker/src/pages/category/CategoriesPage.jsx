import { useMemo, useState } from "react";
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import FlagCircleOutlinedIcon from "@mui/icons-material/FlagCircleOutlined";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import { useGoals } from "../../context/GoalsContext";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import CategoriesDonutChart from "../../components/categories/CategoriesDonutChart";
import CategoriesProgressChart from "../../components/categories/CategoriesProgressChart";
import CategoriesCardsGrid from "../../components/categories/CategoriesCardsGrid";
import SectionCard from "../../components/common/SectionCard";
import { addCustomCategory, readCustomCategories } from "../../utils/categories";

export default function CategoriesPage() {
  const { goals } = useGoals();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [addCategoryError, setAddCategoryError] = useState("");
  const customCategories = readCustomCategories(user?.uid);

  const categories = useMemo(() => {
    const map = new Map();

    goals
      .filter((goal) => goal.status !== "deleted")
      .forEach((goal) => {
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

    customCategories.forEach((name) => {
      if (!map.has(name)) {
        map.set(name, {
          name,
          active: 0,
          completed: 0,
          paused: 0,
          total: 0,
          progressSum: 0,
          targetSum: 0,
        });
      }
    });

    return [...map.values()]
      .map((item) => ({
        ...item,
        progressRate:
          item.targetSum === 0
            ? 0
            : Math.round((item.progressSum / item.targetSum) * 100),
      }))
      .sort((a, b) => b.progressRate - a.progressRate || b.total - a.total);
  }, [goals, customCategories]);

  const totalCategories = categories.length;
  const totalGoals = categories.reduce((acc, item) => acc + item.total, 0);
  const activeGoals = categories.reduce((acc, item) => acc + item.active, 0);
  const completedGoals = categories.reduce((acc, item) => acc + item.completed, 0);
  const avgProgress =
    categories.length === 0
      ? 0
      : Math.round(
          categories.reduce((acc, item) => acc + item.progressRate, 0) /
            categories.length
        );

  const statCardSx = {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 3,
    height: "100%",
    background: isDark
      ? `linear-gradient(180deg, ${alpha(
          theme.palette.background.paper,
          0.92
        )}, ${alpha(theme.palette.background.paper, 0.72)})`
      : `linear-gradient(180deg, ${alpha(
          theme.palette.background.paper,
          0.96
        )}, ${alpha("#f8fafc", 0.94)})`,
    boxShadow: isDark
      ? "0 12px 30px rgba(2,6,23,0.32)"
      : "0 8px 24px rgba(15,23,42,0.08)",
    transition:
      "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: alpha(primary, 0.55),
      boxShadow: isDark
        ? "0 16px 34px rgba(2,6,23,0.44)"
        : "0 12px 28px rgba(15,23,42,0.12)",
    },
  };

  const handleCreateCategory = () => {
    const result = addCustomCategory(user?.uid, newCategory);
    if (!result.ok) {
      if (result.reason === "duplicate") {
        setAddCategoryError(
          isFa ? "این کتگوری قبلاً وجود دارد." : "This category already exists."
        );
      } else {
        setAddCategoryError(
          isFa ? "نام کتگوری را وارد کنید." : "Please enter a category name."
        );
      }
      return;
    }

    setNewCategory("");
    setAddCategoryError("");
    setOpenAddDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: alpha(primary, 0.35),
            borderRadius: 3.2,
            background: isDark
              ? `linear-gradient(120deg, ${alpha(primary, 0.24)}, ${alpha(
                  theme.palette.background.paper,
                  0.9
                )})`
              : `linear-gradient(120deg, ${alpha(primary, 0.12)}, ${alpha(
                  "#ffffff",
                  0.94
                )})`,
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <Stack spacing={0.5}>
                <Typography variant="h4" fontWeight={900}>
                  {t("categoriesPage.title")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("categoriesPage.subtitle")}
                </Typography>
              </Stack>

              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => setOpenAddDialog(true)}
                sx={{
                  gap: 0.75,
                  minHeight: 44,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  "& .MuiButton-startIcon": {
                    margin: 0,
                  },
                }}
              >
                {isFa ? "کتگوری جدید" : "New Category"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={statCardSx}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CategoryRoundedIcon sx={{ color: primary }} fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {t("categoriesPage.stats.categories")}
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  {totalCategories}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("categoriesPage.stats.goalsTracked", {
                    count: totalGoals,
                  })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={statCardSx}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <FlagCircleOutlinedIcon
                    sx={{ color: theme.palette.warning.main }}
                    fontSize="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {t("categoriesPage.active")}
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  {activeGoals}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("categoriesPage.stats.currentlyInProgress")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={statCardSx}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TaskAltRoundedIcon
                    sx={{ color: theme.palette.success.main }}
                    fontSize="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {t("categoriesPage.completed")}
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  {completedGoals}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("categoriesPage.stats.finishedGoals")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={statCardSx}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AutoGraphRoundedIcon sx={{ color: primary }} fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {t("categoriesPage.stats.avgProgress")}
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  {avgProgress}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("categoriesPage.stats.acrossAllCategories")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {categories.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              py: 6,
              textAlign: "center",
              background: isDark
                ? `linear-gradient(180deg, ${alpha(
                    theme.palette.background.paper,
                    0.85
                  )}, ${alpha(theme.palette.background.paper, 0.65)})`
                : `linear-gradient(180deg, ${alpha("#ffffff", 0.96)}, ${alpha(
                    "#f8fafc",
                    0.9
                  )})`,
            }}
          >
            <Typography color="text.secondary">
              {t("categoriesPage.noCategories")}
            </Typography>
          </Card>
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

      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{isFa ? "افزودن کتگوری" : "Add Category"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            margin="dense"
            label={isFa ? "نام کتگوری" : "Category Name"}
            value={newCategory}
            onChange={(event) => {
              setNewCategory(event.target.value);
              setAddCategoryError("");
            }}
            error={Boolean(addCategoryError)}
            helperText={addCategoryError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>{t("common.cancel")}</Button>
          <Button variant="contained" onClick={handleCreateCategory}>
            {isFa ? "ایجاد" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
