import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PauseCircleOutlineRoundedIcon from "@mui/icons-material/PauseCircleOutlineRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  Button,
  useTheme,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function formatDate(date) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString();
}

export default function GoalCard({
  goal,
  onAddProgress,
  onTogglePause,
  onDelete,
  onEdit,
  onViewDetails,
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslation();
  const handleViewDetails = () => {
    if (typeof onViewDetails === "function") {
      onViewDetails();
      return;
    }
    if (goal?.id) {
      navigate(`/goals/${goal.id}`);
    }
  };

  const percent = Math.round((goal.progress / Math.max(goal.target, 1)) * 100);
  const isCompleted = goal.status === "completed";

  const dateItems = [
    { label: t("goalCard.start"), value: formatDate(goal.startDate) },
    { label: t("goalCard.end"), value: formatDate(goal.endDate) },
    { label: t("goalCard.deadline"), value: formatDate(goal.deadline) },
  ].filter((item) => item.value);
  const detailItems = [
    { label: t("goalForm.frequency"), value: goal.frequency },
    { label: t("goalForm.startTime"), value: goal.startTime },
    { label: t("goalForm.endTime"), value: goal.endTime },
  ].filter((item) => String(item.value || "").trim() !== "");

  const progressColor = goal.color || "#2563eb";

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
    borderRadius: 2,
    px: 1.15,
    py: 0.45,
    minHeight: 34,
    textTransform: "none",
    fontWeight: 700,
    fontSize: "0.86rem",
    letterSpacing: 0,
    width: "100%",
    columnGap: 0.65,
    "& .MuiButton-startIcon": {
      margin: 0,
    },
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3.5,
        width: "100%",
        height: "100%",
        border: "1px solid",
        borderColor: isDark ? "rgba(148,163,184,0.3)" : "rgba(15,23,42,0.12)",
        background: isDark
          ? "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(15,23,42,0.84))"
          : "linear-gradient(180deg, rgba(255,255,255,1), rgba(248,250,252,0.94))",
        color: isDark ? "#e2e8f0" : "#0f172a",
        transition: "transform 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isDark
            ? "0 12px 26px rgba(2,6,23,0.45)"
            : "0 10px 24px rgba(15,23,42,0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={1.6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Stack spacing={0.25} sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                fontWeight={800}
                noWrap
                sx={{ color: isDark ? "#f8fafc" : "#0f172a" }}
              >
                {goal.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: isDark ? "#94a3b8" : "#64748b" }}
              >
                {goal.type} • {goal.unit || "-"}
              </Typography>
            </Stack>
            <Chip
              size="small"
              label={t(`common.${goal.status}`)}
              variant="outlined"
              sx={{
                borderRadius: 999,
                fontWeight: 700,
                textTransform: "capitalize",
                ...statusChipSx,
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip size="small" variant="outlined" label={goal.category} />
            {goal.priority && (
              <Chip size="small" variant="outlined" label={goal.priority} />
            )}
          </Stack>

          <Stack spacing={0.75}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" fontWeight={700}>
                {goal.progress}/{goal.target} {goal.unit || ""}
              </Typography>
              <Chip
                size="small"
                label={`${percent}%`}
                sx={{ fontWeight: 800 }}
              />
            </Stack>
            <LinearProgress
              value={percent}
              variant="determinate"
              sx={{
                height: 10,
                borderRadius: 999,
                bgcolor: isDark
                  ? "rgba(148,163,184,0.22)"
                  : "rgba(15,23,42,0.12)",
                "& .MuiLinearProgress-bar": { bgcolor: progressColor },
              }}
            />
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{ color: isDark ? "#cbd5e1" : "#334155" }}
            >
              {t("goalCard.completePercent", { count: percent })}
            </Typography>
          </Stack>

          {dateItems.length > 0 && (
            <Stack
              spacing={0.35}
              sx={{ color: isDark ? "#cbd5e1" : "#334155" }}
            >
              <Divider
                sx={{
                  borderColor: isDark
                    ? "rgba(148,163,184,0.18)"
                    : "rgba(148,163,184,0.35)",
                }}
              />
              {dateItems.map((item) => (
                <Typography key={item.label} variant="caption" fontWeight={700}>
                  {item.label}: {item.value}
                </Typography>
              ))}
            </Stack>
          )}

          {(detailItems.length > 0 || String(goal.notes || "").trim() !== "") && (
            <Stack spacing={0.35} sx={{ color: isDark ? "#cbd5e1" : "#334155" }}>
              {detailItems.map((item) => (
                <Typography key={item.label} variant="caption" fontWeight={700}>
                  {item.label}: {item.value}
                </Typography>
              ))}
              {String(goal.notes || "").trim() !== "" && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {t("goalForm.notes")}: {goal.notes}
                </Typography>
              )}
            </Stack>
          )}

          {goal?.id && (
            <Box
              component="button"
              onClick={handleViewDetails}
              type="button"
              sx={{
                mt: 0.25,
                p: 0,
                width: "100%",
                border: "none",
                outline: "none",
                cursor: "pointer",
                borderRadius: 2,
                textAlign: "left",
                background: "transparent",
                transition: "transform 140ms ease",
                "&:hover": { transform: "translateX(2px)" },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  px: 1.2,
                  py: 0.9,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: isDark
                    ? alpha(theme.palette.primary.main, 0.45)
                    : alpha(theme.palette.primary.main, 0.34),
                  bgcolor: isDark
                    ? alpha(theme.palette.primary.main, 0.14)
                    : alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  useFlexGap
                  sx={{ gap: 0.8 }}
                >
                  <LaunchRoundedIcon
                    sx={{
                      fontSize: 16,
                      color: theme.palette.primary.main,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: "0.02em",
                      color: isDark
                        ? alpha(theme.palette.primary.light, 0.95)
                        : theme.palette.primary.dark,
                    }}
                  >
                    {t("goalCard.openGoalDetails")}
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: isDark
                      ? alpha(theme.palette.primary.light, 0.9)
                      : alpha(theme.palette.primary.dark, 0.9),
                  }}
                >
                  {t("goalCard.view")}
                </Typography>
              </Stack>
            </Box>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(3, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
              },
              gap: 1,
            }}
          >
            <Tooltip title={t("goalCard.markProgress")} arrow>
              <span style={{ gridColumn: "1 / -1" }}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddTaskOutlinedIcon />}
                  onClick={onAddProgress}
                  disabled={goal.status === "paused" || isCompleted}
                  sx={{
                    ...chipButtonSx,
                    justifyContent: "center",
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    border: "1px solid transparent",
                    "&:hover": { bgcolor: theme.palette.primary.dark },
                    "&.Mui-disabled": {
                      color: isDark
                        ? "rgba(203,213,225,0.45)"
                        : "rgba(100,116,139,0.65)",
                      borderColor: isDark
                        ? "rgba(148,163,184,0.22)"
                        : "rgba(148,163,184,0.35)",
                      bgcolor: isDark
                        ? "rgba(148,163,184,0.08)"
                        : "rgba(226,232,240,0.7)",
                    },
                  }}
                >
                  {t("goalCard.markProgress")}
                </Button>
              </span>
            </Tooltip>

            <Tooltip
              title={
                goal.status === "paused"
                  ? t("goalCard.resume")
                  : t("goalCard.pause")
              }
              arrow
            >
              <span style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={
                    goal.status === "paused" ? (
                      <PlayCircleOutlineRoundedIcon />
                    ) : (
                      <PauseCircleOutlineRoundedIcon />
                    )
                  }
                  onClick={onTogglePause}
                  disabled={isCompleted}
                  sx={{
                    ...chipButtonSx,
                    justifyContent: "center",
                    width: "fit-content",
                    minWidth: 96,
                    color: isDark ? "#fde68a" : "#92400e",
                    bgcolor: isDark
                      ? "rgba(146,64,14,0.45)"
                      : "rgba(254,243,199,0.95)",
                    borderColor: isDark
                      ? "rgba(245,158,11,0.82)"
                      : "rgba(217,119,6,0.45)",
                    "&:hover": {
                      borderColor: isDark ? "#fde68a" : "#b45309",
                      bgcolor: isDark
                        ? "rgba(146,64,14,0.62)"
                        : "rgba(253,230,138,0.95)",
                    },
                  }}
                >
                  {goal.status === "paused"
                    ? t("goalCard.resume")
                    : t("goalCard.pause")}
                </Button>
              </span>
            </Tooltip>

            <Tooltip title={t("goalCard.edit")} arrow>
              <span style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditRoundedIcon />}
                  onClick={onEdit}
                  sx={{
                    ...chipButtonSx,
                    justifyContent: "center",
                    width: "fit-content",
                    minWidth: 96,
                    color: isDark ? "#bbf7d0" : "#166534",
                    bgcolor: isDark
                      ? "rgba(22,101,52,0.45)"
                      : "rgba(220,252,231,0.95)",
                    borderColor: isDark
                      ? "rgba(34,197,94,0.82)"
                      : "rgba(22,163,74,0.45)",
                    "&:hover": {
                      borderColor: isDark ? "#86efac" : "#15803d",
                      bgcolor: isDark
                        ? "rgba(22,101,52,0.62)"
                        : "rgba(187,247,208,0.95)",
                    },
                  }}
                >
                  {t("goalCard.edit")}
                </Button>
              </span>
            </Tooltip>

            <Tooltip title={t("goalCard.delete")} arrow>
              <span style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteOutlineRoundedIcon />}
                  onClick={onDelete}
                  sx={{
                    ...chipButtonSx,
                    justifyContent: "center",
                    width: "fit-content",
                    minWidth: 96,
                    borderColor: isDark
                      ? "rgba(239,68,68,0.82)"
                      : "rgba(220,38,38,0.45)",
                    bgcolor: isDark
                      ? "rgba(127,29,29,0.5)"
                      : "rgba(254,226,226,0.95)",
                    color: isDark ? "#fee2e2" : "#991b1b",
                    "&:hover": {
                      borderColor: isDark ? "#fecaca" : "#dc2626",
                      bgcolor: isDark
                        ? "rgba(127,29,29,0.68)"
                        : "rgba(254,202,202,0.95)",
                    },
                  }}
                >
                  {t("goalCard.delete")}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
