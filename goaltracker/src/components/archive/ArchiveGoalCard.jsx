import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import RestoreRoundedIcon from "@mui/icons-material/RestoreRounded";
import { useTranslation } from "react-i18next";

function formatDate(date) {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString();
}

function getRelativeTimeLabel(value) {
  if (!value) return "-";
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return "-";

  const now = Date.now();
  const diffMs = target.getTime() - now;
  const diffMins = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  if (Math.abs(diffMins) < 60) return formatter.format(diffMins, "minute");
  if (Math.abs(diffHours) < 24) return formatter.format(diffHours, "hour");
  return formatter.format(diffDays, "day");
}

export default function ArchiveGoalCard({ goal, type, onRestore }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isDeleted = type === "deleted";
  const statusDate = isDeleted ? goal.deletedAt : goal.completedAt;
  const statusLabel = isDeleted
    ? t("archivePage.deletedAt")
    : t("archivePage.completedAt");
  const statusColor = isDeleted
    ? theme.palette.error.main
    : theme.palette.success.main;
  const restoreColor = theme.palette.primary.main;

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: isDark
          ? "rgba(148,163,184,0.35)"
          : "rgba(148,163,184,0.3)",
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
          ? "0 14px 36px rgba(2,6,23,0.32)"
          : "0 10px 30px rgba(15,23,42,0.08)",
        transition:
          "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
        "&:hover": {
          transform: "translateY(-3px)",
          borderColor: alpha(restoreColor, 0.58),
          boxShadow: isDark
            ? "0 18px 40px rgba(2,6,23,0.45)"
            : "0 16px 36px rgba(15,23,42,0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={1.25}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Typography variant="subtitle1" fontWeight={800}>
              {goal.title}
            </Typography>
            <Chip
              size="small"
              label={isDeleted ? t("common.deleted") : t("common.completed")}
              variant="outlined"
              sx={{
                borderColor: alpha(statusColor, 0.58),
                color: statusColor,
                fontWeight: 700,
                bgcolor: alpha(statusColor, 0.12),
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip size="small" label={goal.category} variant="outlined" />
            <Chip
              size="small"
              label={`${goal.progress}/${goal.target} ${goal.unit}`}
              variant="outlined"
            />
          </Stack>

          <Typography variant="caption" color="text.secondary">
            {statusLabel}: {formatDate(statusDate)} -{" "}
            {getRelativeTimeLabel(statusDate)}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {t("archivePage.exactTime")}:{" "}
            {statusDate ? new Date(statusDate).toLocaleString() : "-"}
          </Typography>

          <Button
            variant="outlined"
            startIcon={<RestoreRoundedIcon />}
            onClick={onRestore}
            sx={{
              alignSelf: "flex-start",
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 700,
              borderColor: alpha(restoreColor, 0.62),
              color: restoreColor,
              bgcolor: alpha(restoreColor, 0.12),
              "&:hover": {
                borderColor: restoreColor,
                bgcolor: alpha(restoreColor, 0.2),
              },
            }}
          >
            {isDeleted
              ? t("archivePage.restoreGoal")
              : t("archivePage.restoreToActive")}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
