import {
  Box,
  Typography,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  RadioGroup,
  Radio,
  Divider,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function Settings({
  currentTheme,
  toggleTheme,
  primaryColor,
  setPrimaryColor,
}) {
  const { t, i18n } = useTranslation();

  const [reminder, setReminder] = useState(
    JSON.parse(localStorage.getItem("reminder")) ?? false
  );
  useEffect(() => localStorage.setItem("reminder", reminder), [reminder]);

  const [weekStart, setWeekStart] = useState(
    localStorage.getItem("weekStart") ?? "monday"
  );
  useEffect(() => localStorage.setItem("weekStart", weekStart), [weekStart]);

  const [animations, setAnimations] = useState(
    JSON.parse(localStorage.getItem("animations")) ?? true
  );
  useEffect(() => localStorage.setItem("animations", animations), [animations]);

  const [openConfirm, setOpenConfirm] = useState(false);
  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Theme Colors
  const themeColors = [
    { value: "blue", label: t("settings.themeColor"), hex: "#1976d2" },
    { value: "green", label: t("settings.themeColor"), hex: "#2e7d32" },
    { value: "purple", label: t("settings.themeColor"), hex: "#7b1fa2" },
    { value: "pink", label: t("settings.themeColor"), hex: "#c2185b" },
  ];

  return (
    <Box p={{ xs: 2, sm: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("nav.settings")}
      </Typography>

      {/* Appearance */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("settings.appearance")}
          </Typography>

          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
          >
            {/* Language Toggle */}
            <Button
              variant="outlined"
              onClick={() =>
                i18n.changeLanguage(i18n.language === "fa" ? "en" : "fa")
              }
            >
              {i18n.language === "fa" ? "EN" : "FA"}
            </Button>

            {/* Dark/Light Mode */}
            <FormControlLabel
              control={
                <Tooltip
                  title={
                    currentTheme === "dark"
                      ? t("common.dark")
                      : t("common.light")
                  }
                >
                  <IconButton onClick={toggleTheme} color="primary">
                    {currentTheme === "dark" ? (
                      <DarkModeIcon />
                    ) : (
                      <LightModeIcon />
                    )}
                  </IconButton>
                </Tooltip>
              }
              label={
                currentTheme === "dark" ? t("common.dark") : t("common.light")
              }
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Theme Color */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("settings.themeColor")}
          </Typography>
          <RadioGroup
            row
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
          >
            {themeColors.map((color) => (
              <Tooltip
                key={color.value}
                title={
                  i18n.language === "fa"
                    ? t("settings.applyTheme", {
                        color: t(`settings.colors.${color.value}`),
                      })
                    : `Apply ${color.value} theme`
                }
                placement="top"
              >
                <FormControlLabel
                  value={color.value}
                  control={
                    <Radio
                      sx={{
                        color: color.hex,
                        "&.Mui-checked": { color: color.hex },
                      }}
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        bgcolor: color.hex,
                      }}
                    />
                  }
                  sx={{ alignItems: "center" }}
                />
              </Tooltip>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("settings.preferences")}
          </Typography>

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={reminder}
                  onChange={() => setReminder(!reminder)}
                  color="primary"
                />
              }
              label={t("settings.dailyReminder")}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              {i18n.language === "fa"
                ? "دریافت یادآوری روزانه برای ثبت پیشرفت"
                : "Receive daily notifications to log your progress"}
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={animations}
                  onChange={() => setAnimations(!animations)}
                  color="primary"
                />
              }
              label={t("settings.animations")}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              {i18n.language === "fa"
                ? "انیمیشن‌های روان تجربه کاربری را بهتر می‌کنند"
                : "Smooth animations enhance UI experience"}
            </Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            {t("settings.weekStart")}
          </Typography>

          <RadioGroup
            row
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
          >
            <FormControlLabel
              value="monday"
              control={<Radio />}
              label={t("settings.monday")}
            />
            <FormControlLabel
              value="sunday"
              control={<Radio />}
              label={t("settings.sunday")}
            />
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "error.main" }}>
            {t("settings.dangerZone")}
          </Typography>
          <Button
            startIcon={<WarningAmberIcon />}
            color="error"
            variant="contained"
            onClick={() => setOpenConfirm(true)}
            sx={{
              "&:hover": {
                background: "linear-gradient(45deg, #ff1744, #f50057)",
              },
            }}
          >
            {t("settings.reset")}
          </Button>

          <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
            <DialogTitle>⚠️ {t("settings.confirmTitle")}</DialogTitle>
            <DialogContent>{t("settings.confirmText")}</DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirm(false)}>
                {t("common.cancel")}
              </Button>
              <Button color="error" onClick={handleReset}>
                {t("settings.reset")}
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
}
