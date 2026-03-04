import Grid from "@mui/material/Grid";
import FlagCircleOutlinedIcon from "@mui/icons-material/FlagCircleOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { useTranslation } from "react-i18next";
import MetricCard from "./MetricCard";
import SectionCard from "../common/SectionCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardStatsGrid({ stats }) {
  const { t } = useTranslation();

  const categoryData = [
    { category: "Health", progress: stats.categoryProgress?.Health || 0 },
    { category: "Study", progress: stats.categoryProgress?.Study || 0 },
    { category: "Work", progress: stats.categoryProgress?.Work || 0 },
    { category: "Personal", progress: stats.categoryProgress?.Personal || 0 },
  ];

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title={t("dashboard.activeGoals")}
            value={stats.activeCount}
            subtitle={t("dashboard.currentlyInProgress")}
            color="#1976d2"
            icon={<FlagCircleOutlinedIcon fontSize="small" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title={t("dashboard.completed")}
            value={stats.completedCount}
            subtitle={t("dashboard.finishedTargets")}
            color="#2e7d32"
            icon={<CheckCircleOutlineRoundedIcon fontSize="small" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title={t("dashboard.currentStreak")}
            value={`${stats.streak}d`}
            subtitle={t("dashboard.consecutiveDays")}
            color="#ed6c02"
            icon={<LocalFireDepartmentOutlinedIcon fontSize="small" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title={t("dashboard.totalXP")}
            value={stats.xpTotal}
            subtitle={t("dashboard.progressPoints")}
            color="#9c27b0"
            icon={<WorkspacePremiumOutlinedIcon fontSize="small" />}
          />
        </Grid>
      </Grid>

      <SectionCard title={t("dashboard.categoryProgress")}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={categoryData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="progress" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
    </>
  );
}
