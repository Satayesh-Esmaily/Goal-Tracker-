import { useEffect, useMemo, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Collapse,
  Grid,
  Stack,
  Box,
  Chip,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useGoals } from "../../context/GoalsContext";
import { useTranslation } from "react-i18next";
import { createGoalFormSchema, goalFormDefaultValues } from "./goalFormSchema";

const categories = ["Health", "Study", "Work", "Personal", "Fitness", "Hobby"];
const types = [
  { value: "daily", label: "Daily" },
  { value: "count", label: "Count Based" },
  { value: "time", label: "Time Based" },
];
const priorities = ["Low", "Medium", "High"];
const units = ["Pages", "Sessions", "Minutes", "Hours"];

export default function GoalForm({
  initialData = null,
  onSubmitGoal = null,
  submitLabel = null,
  title = null,
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { createGoal } = useGoals();
  const { t, i18n } = useTranslation();
  const [showOptional, setShowOptional] = useState(true);
  const schema = useMemo(() => createGoalFormSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: goalFormDefaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [
    watchedTitle,
    watchedCategory,
    watchedType,
    watchedTarget,
    watchedUnit,
    watchedPriority,
    watchedStartDate,
    watchedEndDate,
    watchedDeadline,
  ] = useWatch({
    control,
    name: [
      "title",
      "category",
      "type",
      "target",
      "unit",
      "priority",
      "startDate",
      "endDate",
      "deadline",
    ],
  });

  const isCreateEnabled =
    String(watchedTitle || "").trim() !== "" &&
    String(watchedCategory || "").trim() !== "" &&
    String(watchedType || "").trim() !== "" &&
    String(watchedTarget || "").trim() !== "" &&
    String(watchedUnit || "").trim() !== "" &&
    String(watchedPriority || "").trim() !== "" &&
    String(watchedStartDate || "").trim() !== "" &&
    String(watchedEndDate || "").trim() !== "" &&
    String(watchedDeadline || "").trim() !== "";

  useEffect(() => {
    if (!initialData) return;
    reset({
      title: initialData.title || "",
      category: initialData.category || "",
      type: initialData.type || "daily",
      target: initialData.target ?? "",
      unit: initialData.unit || "Sessions",
      priority: initialData.priority || "Medium",
      startDate: initialData.startDate || "",
      endDate: initialData.endDate || "",
      deadline: initialData.deadline || "",
      frequency: initialData.frequency || "",
      color: initialData.color || "#2563eb",
      notes: initialData.notes || "",
      startTime: initialData.startTime || "",
      endTime: initialData.endTime || "",
      status: initialData.status || "active",
    });
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      target: Number(data.target),
      status: "active",
    };

    try {
      if (onSubmitGoal) {
        await onSubmitGoal(payload);
        navigate("/", { replace: true });
        return;
      }

      createGoal(payload);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Failed to save goal:", error);
      setError("root", {
        type: "manual",
        message: t("goalForm.saveFailed"),
      });
    }
  };

  const panelSx = {
    p: { xs: 1.5, md: 2 },
    borderRadius: 2.5,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: isDark ? "rgba(15,23,42,0.32)" : "rgba(248,250,252,0.7)",
    height: "100%",
  };
  const dateTimeFieldSx = {
    "& input::-webkit-calendar-picker-indicator": {
      opacity: 0,
      width: 0,
      position: "absolute",
    },
  };
  const openNativePicker = (event) => {
    const fieldRoot = event.currentTarget.closest(".MuiFormControl-root");
    const input = fieldRoot?.querySelector("input");
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        background: isDark
          ? "linear-gradient(145deg, rgba(15,23,42,0.97), rgba(15,23,42,0.86))"
          : "linear-gradient(145deg, rgba(255,255,255,1), rgba(248,250,252,0.95))",
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 1.25,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          background: isDark
            ? "linear-gradient(90deg, rgba(37,99,235,0.18), rgba(14,165,233,0.12))"
            : "linear-gradient(90deg, rgba(37,99,235,0.1), rgba(14,165,233,0.08))",
        }}
      >
        <AutoAwesomeRoundedIcon color="primary" />
        <Typography fontWeight={800}>{t("goalForm.builderTitle")}</Typography>
      </Box>

      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h4" fontWeight={800}>
              {title ||
                (initialData
                  ? t("goalForm.editTitle")
                  : t("goalForm.createTitle"))}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.6 }}>
              {t("goalForm.subtitle")}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Stack spacing={2.5}>
              {errors.root?.message && (
                <Typography color="error" variant="body2">
                  {errors.root.message}
                </Typography>
              )}
              <Grid container spacing={2.5}>
                <Grid item xs={12} lg={8}>
                  <Box sx={panelSx}>
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography fontWeight={800}>
                          {t("goalForm.requiredInputs")}
                        </Typography>
                        <Chip
                          size="small"
                          label={t("goalForm.required")}
                          color="primary"
                        />
                      </Stack>

                      <Grid container spacing={2}>
                        {/* ... بقیه فیلدها مثل title, category, type ... */}
                      </Grid>
                    </Stack>
                  </Box>
                </Grid>

                <Grid item xs={12} lg={4}>
                  <Box sx={panelSx}>
                    <Stack spacing={1.5}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography fontWeight={800}>
                            {t("goalForm.optional")}
                          </Typography>
                          <Chip
                            size="small"
                            label={t("goalForm.planner")}
                            variant="outlined"
                          />
                        </Stack>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => setShowOptional((prev) => !prev)}
                          endIcon={
                            <ExpandMoreRoundedIcon
                              sx={{
                                transform: showOptional
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                                transition: "transform 200ms ease",
                              }}
                            />
                          }
                        >
                          {showOptional
                            ? t("goalForm.hide")
                            : t("goalForm.show")}
                        </Button>
                      </Stack>

                      <Collapse in={showOptional}>
                        <Stack spacing={1.5}></Stack>
                      </Collapse>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.25}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{ borderRadius: 2.5, px: 2 }}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isCreateEnabled || isSubmitting}
                  sx={{
                    borderRadius: 2.5,
                    px: 2.75,
                    minWidth: 160,
                    fontWeight: 700,
                  }}
                >
                  {submitLabel ||
                    (initialData
                      ? t("common.saveChanges")
                      : t("goalForm.createGoal"))}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </CardContent>
    </Card>
  );
}
