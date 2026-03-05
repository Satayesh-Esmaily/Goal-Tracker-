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
  Container,
  useTheme as useMuiTheme,
  TextField,
  MenuItem,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { useTheme as useAppTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { mode, toggleMode, primaryColor, setPrimaryColor } = useAppTheme();
  const { user, updateProfile } = useAuth();
  const muiTheme = useMuiTheme();
  const isDark = muiTheme.palette.mode === "dark";
  const primary = muiTheme.palette.primary.main;
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profileFocus, setProfileFocus] = useState(user?.focusArea || "study");
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    setProfileName(user?.name || "");
    setProfileEmail(user?.email || "");
    setProfileFocus(user?.focusArea || "study");
  }, [user]);

  // Preferences
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

  // Danger Zone
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Theme Colors
  const themeColors = [
    { value: "blue", hex: "#1976d2" },
    { value: "green", hex: "#2e7d32" },
    { value: "purple", hex: "#7b1fa2" },
    { value: "pink", hex: "#c2185b" },
  ];

  const sectionCardSx = {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 3,
    overflow: "hidden",
    background: isDark
      ? `linear-gradient(180deg, ${alpha(muiTheme.palette.background.paper, 0.92)}, ${alpha(
          muiTheme.palette.background.paper,
          0.78
        )})`
      : `linear-gradient(180deg, ${alpha("#ffffff", 0.98)}, ${alpha("#f8fafc", 0.94)})`,
    boxShadow: isDark ? "0 10px 26px rgba(2,6,23,0.32)" : "0 10px 22px rgba(15,23,42,0.08)",
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
              ? `linear-gradient(120deg, ${alpha(primary, 0.24)}, ${alpha(muiTheme.palette.background.paper, 0.9)})`
              : `linear-gradient(120deg, ${alpha(primary, 0.12)}, ${alpha("#ffffff", 0.94)})`,
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack spacing={0.5}>
              <Typography variant="h4" fontWeight={900}>
                {t("nav.settings")}
              </Typography>
              <Typography color="text.secondary">{t("settings.subtitle")}</Typography>
            </Stack>
          </CardContent>
        </Card>

      {/* Appearance */}
        <Card elevation={0} sx={sectionCardSx}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("settings.appearance")}
          </Typography>

          <Stack
            gap={1.5}
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            {/* Language Toggle */}
            <Button
              variant="outlined"
              onClick={() =>
                i18n.changeLanguage(i18n.language === "fa" ? "en" : "fa")
              }
              sx={{
                borderRadius: 999,
                px: 2.2,
                minHeight: 42,
                minWidth: 96,
                fontWeight: 800,
                textTransform: "none",
                borderColor: alpha(primary, 0.48),
                color: isDark ? "#c4b5fd" : alpha(primary, 0.9),
                bgcolor: isDark ? alpha("#0f172a", 0.58) : alpha("#ffffff", 0.88),
                "&:hover": {
                  borderColor: primary,
                  bgcolor: isDark ? alpha(primary, 0.2) : alpha(primary, 0.12),
                },
              }}
            >
              {i18n.language === "fa" ? "EN" : "FA"}
            </Button>

            {/* Dark/Light Mode */}
            <Tooltip title={mode === "dark" ? t("common.dark") : t("common.light")}>
              <Button
                onClick={toggleMode}
                variant="outlined"
                startIcon={mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
                sx={{
                  gap: 1,
                  borderRadius: 999,
                  px: 2.2,
                  minHeight: 42,
                  minWidth: 130,
                  fontWeight: 800,
                  textTransform: "none",
                  borderColor: alpha(primary, 0.48),
                  color: isDark ? "#e2e8f0" : "#0f172a",
                  bgcolor: isDark ? alpha("#0f172a", 0.58) : alpha("#ffffff", 0.88),
                  "&:hover": {
                    borderColor: primary,
                    bgcolor: isDark ? alpha(primary, 0.2) : alpha(primary, 0.12),
                  },
                  "& .MuiButton-startIcon": {
                    margin: 0,
                  },
                }}
              >
                {mode === "dark" ? t("common.dark") : t("common.light")}
              </Button>
            </Tooltip>
          </Stack>
        </CardContent>
      </Card>

      {/* Profile */}
      <Card elevation={0} sx={sectionCardSx}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("settings.profile.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("settings.profile.subtitle")}
          </Typography>

          <Stack spacing={2}>
            <TextField
              label={t("settings.profile.name")}
              value={profileName}
              onChange={(event) => {
                setProfileSaved(false);
                setProfileName(event.target.value);
              }}
              fullWidth
            />
            <TextField
              label={t("settings.profile.email")}
              value={profileEmail}
              onChange={(event) => {
                setProfileSaved(false);
                setProfileEmail(event.target.value);
              }}
              fullWidth
            />
            <TextField
              select
              label={t("settings.profile.mainFocus")}
              value={profileFocus}
              onChange={(event) => {
                setProfileSaved(false);
                setProfileFocus(event.target.value);
              }}
              fullWidth
            >
              <MenuItem value="study">{t("loginPage.focus.study")}</MenuItem>
              <MenuItem value="work">{t("loginPage.focus.work")}</MenuItem>
              <MenuItem value="health">{t("loginPage.focus.health")}</MenuItem>
              <MenuItem value="personal">{t("loginPage.focus.personal")}</MenuItem>
            </TextField>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color={profileSaved ? "success.main" : "text.secondary"}>
                {profileSaved ? t("settings.profile.saved") : t("settings.profile.helper")}
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  updateProfile({
                    name: profileName,
                    email: profileEmail,
                    focusArea: profileFocus,
                  });
                  setProfileSaved(true);
                }}
                sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 700, px: 2.2 }}
              >
                {t("settings.profile.save")}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Theme Color */}
        <Card elevation={0} sx={sectionCardSx}>
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
                title={`Apply ${color.value} theme`}
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
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: color.hex,
                        border: "2px solid",
                        borderColor:
                          primaryColor === color.value
                            ? (isDark ? "#e2e8f0" : "#0f172a")
                            : "transparent",
                        boxShadow:
                          primaryColor === color.value
                            ? "0 0 0 3px rgba(59,130,246,0.18)"
                            : "none",
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
        <Card elevation={0} sx={sectionCardSx}>
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
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: alpha(muiTheme.palette.error.main, 0.35),
            borderRadius: 3,
            overflow: "hidden",
            background: isDark
              ? `linear-gradient(180deg, ${alpha(muiTheme.palette.background.paper, 0.92)}, ${alpha(
                  muiTheme.palette.error.dark,
                  0.12
                )})`
              : `linear-gradient(180deg, ${alpha("#ffffff", 0.98)}, ${alpha(muiTheme.palette.error.light, 0.08)})`,
            boxShadow: isDark ? "0 10px 26px rgba(2,6,23,0.32)" : "0 10px 22px rgba(15,23,42,0.08)",
          }}
        >
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
      </Stack>
    </Container>
  );
}
