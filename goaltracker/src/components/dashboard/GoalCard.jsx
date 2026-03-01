import { Card, CardContent, Chip, LinearProgress, Stack, Typography, Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

function formatDate(date) {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString();
}

export default function GoalCard({ goal, onAddProgress, onTogglePause, onDelete, onEdit }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslation();
  const percent = Math.round((goal.progress / goal.target) * 100);
  const isCompleted = goal.status === "completed";
  const cardBlue = "#156fc7";
  const progressColor = goal.color || "#dbeafe";
  const statusChipSx =
    goal.status === "completed"
      ? {
          color: "#bbf7d0",
          bgcolor: "rgba(22,101,52,0.52)",
          borderColor: "rgba(34,197,94,0.92)",
        }
      : goal.status === "paused"
      ? {
          color: "#fef3c7",
          bgcolor: "rgba(146,64,14,0.52)",
          borderColor: "rgba(245,158,11,0.92)",
        }
      : {
          color: "#bae6fd",
          bgcolor: "rgba(3,105,161,0.52)",
          borderColor: "rgba(56,189,248,0.92)",
        };
  const chipButtonSx = {
    borderRadius: 999,
    px: 1.55,
    py: 0.38,
    minHeight: 30,
    textTransform: "none",
    fontWeight: 700,
    letterSpacing: 0,
    fontSize: "0.95rem",
    lineHeight: 1.1,
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3.5,
        height: "100%",
        border: "1px solid",
        borderColor: isDark ? "rgba(191,219,254,0.28)" : "rgba(21,111,199,0.35)",
        bgcolor: cardBlue,
        color: "#f8fbff",
        transition: "transform 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 24px rgba(21,111,199,0.38)",
        },
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={1.75}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ color: "#ffffff" }}>
              {goal.title}
            </Typography>
            <Chip
              size="small"
              label={t(`common.${goal.status}`)}
              variant="outlined"
              sx={{
                borderRadius: 999,
                textTransform: "capitalize",
                fontWeight: 700,
                letterSpacing: 0,
                ...statusChipSx,
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <Chip size="small" variant="outlined" label={goal.category} />
            <Chip size="small" variant="outlined" label={goal.type} />
          </Stack>

          <Stack spacing={0.75}>
            <Typography variant="body2" fontWeight={700} sx={{ color: "#ffffff" }}>
              {goal.progress}/{goal.target} {goal.unit}
            </Typography>
            <LinearProgress
              value={percent}
              variant="determinate"
              sx={{
                height: 10,
                borderRadius: 999,
                bgcolor: "rgba(248,251,255,0.25)",
                "& .MuiLinearProgress-bar": { bgcolor: progressColor },
              }}
            />
            <Typography variant="caption" fontWeight={700} sx={{ color: "#ffffff" }}>
              {t("goalCard.completePercent", { count: percent })}
            </Typography>
          </Stack>

          <Stack spacing={0.35} sx={{ color: "#ffffff" }}>
            <Typography variant="caption" fontWeight={700}>{t("goalCard.start")}: {formatDate(goal.startDate)}</Typography>
            <Typography variant="caption" fontWeight={700}>{t("goalCard.end")}: {formatDate(goal.endDate)}</Typography>
            <Typography variant="caption" fontWeight={700}>{t("goalCard.deadline")}: {formatDate(goal.deadline)}</Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} useFlexGap flexWrap="wrap">
            <Button
              size="small"
              variant="outlined"
              onClick={onAddProgress}
              disabled={goal.status === "paused" || isCompleted}
              sx={{
                ...chipButtonSx,
                bgcolor: "rgba(3,105,161,0.48)",
                color: "#bae6fd",
                border: "1px solid rgba(56,189,248,0.92)",
                "&:hover": { bgcolor: "rgba(3,105,161,0.65)" },
                "&.Mui-disabled": {
                  color: "rgba(255,255,255,0.45)",
                  borderColor: "rgba(255,255,255,0.2)",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              {t("goalCard.markProgress")}
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={onTogglePause}
              disabled={isCompleted}
              sx={{
                ...chipButtonSx,
                color: "#fef3c7",
                bgcolor: "rgba(146,64,14,0.5)",
                borderColor: "rgba(245,158,11,0.92)",
                "&:hover": {
                  borderColor: "#fde68a",
                  bgcolor: "rgba(146,64,14,0.65)",
                },
              }}
            >
              {goal.status === "paused" ? t("goalCard.resume") : t("goalCard.pause")}
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={onEdit}
              sx={{
                ...chipButtonSx,
                color: "#bbf7d0",
                bgcolor: "rgba(22,101,52,0.5)",
                borderColor: "rgba(34,197,94,0.92)",
                "&:hover": {
                  borderColor: "#86efac",
                  bgcolor: "rgba(22,101,52,0.64)",
                },
              }}
            >
              {t("goalCard.edit")}
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={onDelete}
              sx={{
                ...chipButtonSx,
                borderColor: "rgba(239,68,68,0.92)",
                bgcolor: "rgba(127,29,29,0.56)",
                color: "#fee2e2",
                "&:hover": {
                  borderColor: "#fecaca",
                  bgcolor: "rgba(127,29,29,0.7)",
                },
              }}
            >
              {t("goalCard.delete")}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
