import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";


import RestoreRoundedIcon from "@mui/icons-material/RestoreRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import SectionCard from "../../components/common/SectionCard";
import ArchiveGoalCard from "../../components/archive/ArchiveGoalCard";
import { useGoals } from "../../context/GoalsContext";

function sortArchivedGoals(goals, sortBy) {
  const sorted = [...goals];

  sorted.sort((a, b) => {
    const aDate = new Date(a.deletedAt || a.completedAt || a.updatedAt || a.createdAt).getTime();
    const bDate = new Date(b.deletedAt || b.completedAt || b.updatedAt || b.createdAt).getTime();

    if (sortBy === "oldest") return aDate - bDate;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "category") return a.category.localeCompare(b.category);
    return bDate - aDate;
  });

  return sorted;
}

export default function ArchivePage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { goals, restoreGoal, restoreCompletedGoal } = useGoals();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const archivedGoals = useMemo(
    () => goals.filter((goal) => goal.status === "completed" || goal.status === "deleted"),
    [goals]
  );

  const completedGoals = useMemo(() => archivedGoals.filter((goal) => goal.status === "completed"), [archivedGoals]);
  const deletedGoals = useMemo(() => archivedGoals.filter((goal) => goal.status === "deleted"), [archivedGoals]);

  const filteredArchived = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const searched = archivedGoals.filter(
      (goal) =>
        goal.title.toLowerCase().includes(normalizedSearch) ||
        (goal.category || "").toLowerCase().includes(normalizedSearch)
    );

    const tabFiltered = tab === "all" ? searched : searched.filter((goal) => goal.status === tab);
    return sortArchivedGoals(tabFiltered, sortBy);
  }, [archivedGoals, tab, search, sortBy]);

  const filteredCompleted = useMemo(
    () => filteredArchived.filter((goal) => goal.status === "completed"),
    [filteredArchived]
  );
  const filteredDeleted = useMemo(
    () => filteredArchived.filter((goal) => goal.status === "deleted"),
    [filteredArchived]
  );

  const totalRestorable = completedGoals.length + deletedGoals.length;
  const primary = theme.palette.primary.main;
  const statCardSx = {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 3,
    height: "100%",
    background: isDark
      ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.92)}, ${alpha(
          theme.palette.background.paper,
          0.72
        )})`
      : `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.96)}, ${alpha("#f8fafc", 0.94)})`,
    boxShadow: isDark ? "0 12px 30px rgba(2,6,23,0.32)" : "0 8px 24px rgba(15,23,42,0.08)",
    transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: alpha(primary, 0.55),
      boxShadow: isDark ? "0 16px 34px rgba(2,6,23,0.44)" : "0 12px 28px rgba(15,23,42,0.12)",
    },
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
              ? `linear-gradient(120deg, ${alpha(primary, 0.24)}, ${alpha(theme.palette.background.paper, 0.9)})`
              : `linear-gradient(120deg, ${alpha(primary, 0.12)}, ${alpha("#ffffff", 0.94)})`,
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack spacing={0.75}>
              <Typography variant="h4" fontWeight={900}>
                {t("archivePage.title")}
              </Typography>
              <Typography color="text.secondary">{t("archivePage.subtitle")}</Typography>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={statCardSx}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ArchiveRoundedIcon color="primary" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {t("archivePage.totalArchived")}
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  {archivedGoals.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={statCardSx}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TaskAltRoundedIcon sx={{ color: theme.palette.success.main }} fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {t("archivePage.completedOnly")}
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  {completedGoals.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={statCardSx}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <DeleteForeverRoundedIcon sx={{ color: theme.palette.error.main }} fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {t("archivePage.deletedOnly")}
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  {deletedGoals.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={statCardSx}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <RestoreRoundedIcon sx={{ color: primary }} fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {t("archivePage.restorable")}
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  {totalRestorable}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <SectionCard
          title={t("archivePage.filtersTitle")}
          sx={{
            borderColor: alpha(primary, 0.24),
            background: isDark
              ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(
                  theme.palette.background.paper,
                  0.78
                )})`
              : `linear-gradient(180deg, ${alpha("#ffffff", 0.96)}, ${alpha("#f8fafc", 0.9)})`,
          }}
          action={
            <Stack direction={{ xs: "column", sm: "row" }} 
            gap={1.5}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<RestoreRoundedIcon />}
                disabled={filteredCompleted.length === 0}
                onClick={() => filteredCompleted.forEach((goal) => restoreCompletedGoal(goal.id))}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: alpha(primary, 0.6),
                  color: primary,
                  bgcolor: alpha(primary, 0.1),
                  "&:hover": { borderColor: primary, bgcolor: alpha(primary, 0.18) },
                }}
              >
                {t("archivePage.restoreAllCompleted")}
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<RestoreRoundedIcon />}
                disabled={filteredDeleted.length === 0}
                onClick={() => filteredDeleted.forEach((goal) => restoreGoal(goal.id))}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: alpha(primary, 0.6),
                  color: primary,
                  bgcolor: alpha(primary, 0.1),
                  "&:hover": { borderColor: primary, bgcolor: alpha(primary, 0.18) },
                }}
              >
                {t("archivePage.restoreAllDeleted")}
              </Button>
            </Stack>
          }
        >
          <Stack spacing={2}>
            <Tabs value={tab} onChange={(_, next) => setTab(next)} variant="scrollable">
              <Tab value="all" label={t("archivePage.tabs.all")} />
              <Tab value="completed" label={t("archivePage.tabs.completed")} />
              <Tab value="deleted" label={t("archivePage.tabs.deleted")} />
            </Tabs>

            <Stack direction={{ xs: "column", md: "row" }} 
            gap={1.5}>
              <TextField
                fullWidth
                label={t("archivePage.search")}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                select
                label={t("archivePage.sortBy")}
                sx={{ minWidth: 240 }}
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <MenuItem value="newest">{t("archivePage.sortNewest")}</MenuItem>
                <MenuItem value="oldest">{t("archivePage.sortOldest")}</MenuItem>
                <MenuItem value="title">{t("archivePage.sortTitle")}</MenuItem>
                <MenuItem value="category">{t("archivePage.sortCategory")}</MenuItem>
              </TextField>
            </Stack>
          </Stack>
        </SectionCard>

        {filteredArchived.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              textAlign: "center",
              py: { xs: 5, md: 7 },
              px: 2,
              background: isDark
                ? "linear-gradient(180deg, rgba(15,23,42,0.75), rgba(15,23,42,0.55))"
                : "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.92))",
              boxShadow: isDark ? "0 12px 30px rgba(2,6,23,0.35)" : "0 10px 24px rgba(15,23,42,0.08)",
            }}
          >
            <Stack spacing={1.2} alignItems="center">
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: 99,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: alpha(primary, isDark ? 0.16 : 0.12),
                  color: primary,
                }}
              >
                <Inventory2OutlinedIcon />
              </Box>
              <Typography variant="h6" fontWeight={800}>
                {t("archivePage.emptyTitle")}
              </Typography>
              <Typography color="text.secondary">{t("archivePage.emptyDesc")}</Typography>
              <Button
                component={RouterLink}
                to="/goals"
                variant="contained"
                sx={{ mt: 1, borderRadius: 999, textTransform: "none", fontWeight: 700 }}
              >
                {t("archivePage.goToGoals")}
              </Button>
            </Stack>
          </Card>
        ) : (
          <Stack spacing={2.5}>
            {(tab === "all" || tab === "completed") && (
              <SectionCard title={t("archivePage.completedGoals", { count: filteredCompleted.length })}>
                {filteredCompleted.length === 0 ? (
                  <Typography color="text.secondary">{t("archivePage.noCompletedGoals")}</Typography>
                ) : (
                  <Grid container spacing={2}>
                    {filteredCompleted.map((goal) => (
                      <Grid item xs={12} md={6} key={goal.id}>
                        <ArchiveGoalCard
                          goal={goal}
                          type="completed"
                          onRestore={() => restoreCompletedGoal(goal.id)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </SectionCard>
            )}

            {(tab === "all" || tab === "deleted") && (
              <SectionCard title={t("archivePage.deletedGoals", { count: filteredDeleted.length })}>
                {filteredDeleted.length === 0 ? (
                  <Typography color="text.secondary">{t("archivePage.noDeletedGoals")}</Typography>
                ) : (
                  <Grid container spacing={2}>
                    {filteredDeleted.map((goal) => (
                      <Grid item xs={12} md={6} key={goal.id}>
                        <ArchiveGoalCard goal={goal} type="deleted" onRestore={() => restoreGoal(goal.id)} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </SectionCard>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
