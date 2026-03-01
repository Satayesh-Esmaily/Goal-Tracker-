import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Collapse,
  IconButton,
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useGoals } from "../../context/GoalsContext";

const categories = ["Health", "Study", "Work", "Personal", "Fitness", "Hobby"];
const types = [
  { value: "daily", label: "Daily" },
  { value: "count", label: "Count Based" },
  { value: "time", label: "Time Based" },
];
const priorities = ["Low", "Medium", "High"];
const units = ["Pages", "Sessions", "Minutes", "Hours"];

export default function GoalForm({ initialData = null, onSubmitGoal = null, submitLabel = "Create Goal", title = "Create New Goal" }) {
  const navigate = useNavigate();
  const { createGoal } = useGoals();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      type: "daily",
      target: "",
      unit: "Sessions",
      priority: "Medium",
      startDate: "",
      endDate: "",
      deadline: "",
      frequency: "",
      color: "#2563eb",
      notes: "",
      status: "active",
    },
  });

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
      status: initialData.status || "active",
    });
    setShowAdvanced(Boolean(initialData.deadline || initialData.frequency || initialData.notes));
  }, [initialData, reset]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      target: Number(data.target),
      status: "active",
    };

    if (onSubmitGoal) {
      onSubmitGoal(payload);
    } else {
      createGoal(payload);
    }
    navigate("/");
  };

  return (
    <Card elevation={1} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              {title}
            </Typography>
            <Typography color="text.secondary">
              Fill in the details to add a goal to your dashboard.
            </Typography>
          </Stack>

          <Divider />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Title"
                      fullWidth
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Category"
                      fullWidth
                      error={!!errors.category}
                      helperText={errors.category?.message}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Goal Type" fullWidth>
                      {types.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="target"
                  control={control}
                  rules={{
                    required: "Target is required",
                    min: { value: 1, message: "Target must be at least 1" },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Target"
                      fullWidth
                      error={!!errors.target}
                      helperText={errors.target?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Unit" fullWidth>
                      {units.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Priority" fullWidth>
                      {priorities.map((priority) => (
                        <MenuItem key={priority} value={priority}>
                          {priority}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Start Date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="End Date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight={600}>Advanced Options</Typography>
                  <IconButton onClick={() => setShowAdvanced((prev) => !prev)} aria-label="toggle advanced options">
                    <ExpandMoreIcon
                      sx={{
                        transform: showAdvanced ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 200ms ease",
                      }}
                    />
                  </IconButton>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Collapse in={showAdvanced}>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="deadline"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="date"
                            label="Deadline"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="frequency"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Frequency (e.g., 3 times/week)" fullWidth />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Controller
                        name="color"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} type="color" label="Color" fullWidth />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} multiline rows={4} label="Notes" fullWidth />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </Grid>

              <Grid item xs={12}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    {submitLabel}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Stack>
      </CardContent>
    </Card>
  );
}
