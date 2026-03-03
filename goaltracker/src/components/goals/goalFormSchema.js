import * as yup from "yup";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(value) {
  if (!value || !DATE_PATTERN.test(value)) return null;
  return new Date(`${value}T00:00:00`);
}

export const goalFormDefaultValues = {
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
  startTime: "",
  endTime: "",
  status: "active",
};

export function createGoalFormSchema(t) {
  return yup.object({
    title: yup
      .string()
      .trim()
      .required(t("validation.titleRequired"))
      .min(3, t("validation.titleRequired"))
      .max(80, "Title must be 80 characters or less."),
    category: yup.string().required(t("validation.categoryRequired")),
    type: yup.string().oneOf(["daily", "count", "time"]).required(),
    target: yup
      .number()
      .transform((value, originalValue) => (originalValue === "" ? NaN : Number(originalValue)))
      .typeError(t("validation.targetRequired"))
      .required(t("validation.targetRequired"))
      .min(1, t("validation.targetMin"))
      .max(100000, "Target is too large."),
    unit: yup.string().required(),
    priority: yup.string().oneOf(["Low", "Medium", "High"]).required(),
    startDate: yup
      .string()
      .required("Start date is required.")
      .test("start-date-format", "Invalid start date format.", (value) => !value || DATE_PATTERN.test(value)),
    endDate: yup
      .string()
      .required("End date is required.")
      .test("end-date-format", "Invalid end date format.", (value) => !value || DATE_PATTERN.test(value))
      .test("end-after-start", "End date must be after start date.", function validate(value) {
        const startDate = parseDate(this.parent.startDate);
        const endDate = parseDate(value);
        if (!startDate || !endDate) return true;
        return endDate >= startDate;
      }),
    deadline: yup
      .string()
      .required("Deadline is required.")
      .test("deadline-format", "Invalid deadline format.", (value) => !value || DATE_PATTERN.test(value))
      .test("deadline-after-start", "Deadline must be after start date.", function validate(value) {
        const startDate = parseDate(this.parent.startDate);
        const deadline = parseDate(value);
        if (!startDate || !deadline) return true;
        return deadline >= startDate;
      })
      .test("deadline-before-end", "Deadline should not be after end date.", function validate(value) {
        const endDate = parseDate(this.parent.endDate);
        const deadline = parseDate(value);
        if (!endDate || !deadline) return true;
        return deadline <= endDate;
      }),
    frequency: yup.string().max(60, "Frequency must be 60 characters or less."),
    color: yup
      .string()
      .matches(/^#([0-9a-fA-F]{6})$/, "Color must be a valid hex code."),
    notes: yup.string().max(500, "Notes must be 500 characters or less."),
    startTime: yup
      .string()
      .test("start-time-format", "Start time must be HH:mm.", (value) => !value || /^\d{2}:\d{2}$/.test(value)),
    endTime: yup
      .string()
      .test("end-time-format", "End time must be HH:mm.", (value) => !value || /^\d{2}:\d{2}$/.test(value))
      .test("end-time-after-start-time", "End time should be after start time.", function validate(value) {
        const start = this.parent.startTime;
        if (!start || !value) return true;
        return value >= start;
      }),
    status: yup.string().oneOf(["active", "completed", "paused"]).required(),
  });
}
