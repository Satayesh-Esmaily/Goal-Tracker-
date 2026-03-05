import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useTheme as useAppTheme } from "../../context/ThemeContext";
import AuthLoadingScreen from "../../components/common/AuthLoadingScreen";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const { isAuthenticated, loginFake } = useAuth();
  const { t, i18n } = useTranslation();
  const { mode, toggleMode } = useAppTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusArea, setFocusArea] = useState("study");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const displayName = useMemo(() => String(name || "").trim(), [name]);
  const from = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async () => {
    setError("");
    setIsSigningIn(false);

    if (!name.trim()) {
      setError(t("loginPage.errors.fullNameRequired"));
      return;
    }

    if (!email.trim()) {
      setError(t("loginPage.errors.emailRequired"));
      return;
    }

    if (password.trim().length < 4) {
      setError(t("loginPage.errors.passwordMin"));
      return;
    }

    try {
      const loadingStart = Date.now();
      const minLoadingMs = 3000;
      setIsSigningIn(true);
      await loginFake(displayName, { email, focusArea });
      const elapsed = Date.now() - loadingStart;
      const remaining = Math.max(0, minLoadingMs - elapsed);
      if (remaining > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, remaining));
      }
      navigate(from, { replace: true });
    } catch {
      setIsSigningIn(false);
      setError(t("loginPage.errors.loginFailed"));
    }
  };

  if (isSigningIn) {
    return <AuthLoadingScreen />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        bgcolor: "background.default",
        backgroundImage: isDark
          ? `radial-gradient(900px 360px at 80% 10%, ${alpha(
              primary,
              0.2
            )}, transparent 70%)`
          : `radial-gradient(900px 360px at 80% 10%, ${alpha(
              primary,
              0.12
            )}, transparent 70%)`,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 400, md: 880 },
          border: "1px solid",
          borderColor: alpha(primary, 0.32),
          borderRadius: 4,
          overflow: "hidden",
          background: isDark
            ? `linear-gradient(140deg, ${alpha(
                theme.palette.background.paper,
                0.95
              )}, ${alpha(theme.palette.background.paper, 0.82)})`
            : `linear-gradient(140deg, #ffffff, ${alpha("#f8fafc", 0.92)})`,
          boxShadow: isDark
            ? "0 24px 48px rgba(2,6,23,0.46)"
            : "0 20px 40px rgba(15,23,42,0.12)",
        }}
      >
        <Grid container>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                height: "100%",
                minHeight: { xs: 210, md: 520 },
                p: 3,
                color: isDark ? "#dbeafe" : "#0f172a",
                background: isDark
                  ? `linear-gradient(145deg, ${alpha(primary, 0.28)}, ${alpha(
                      "#0f172a",
                      0.86
                    )})`
                  : `linear-gradient(145deg, ${alpha(primary, 0.16)}, ${alpha(
                      "#e2e8f0",
                      0.56
                    )})`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight={900}>
                  {t("loginPage.brand")}
                </Typography>
                <Typography sx={{ mt: 1, opacity: 0.86 }}>
                  {t("loginPage.sideSubtitle")}
                </Typography>
              </Box>

              <Stack spacing={1}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t("loginPage.featureCreate")}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t("loginPage.featureTrack")}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t("loginPage.featureRestore")}
                </Typography>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<TranslateRoundedIcon fontSize="small" />}
                    onClick={() =>
                      i18n.changeLanguage(i18n.language === "fa" ? "en" : "fa")
                    }
                    sx={{
                      borderRadius: 999,
                      minWidth: 94,
                      textTransform: "none",
                      fontWeight: 700,
                    }}
                  >
                    {i18n.language === "fa" ? "EN" : "FA"}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={
                      mode === "dark" ? (
                        <LightModeRoundedIcon fontSize="small" />
                      ) : (
                        <DarkModeRoundedIcon fontSize="small" />
                      )
                    }
                    onClick={toggleMode}
                    sx={{
                      borderRadius: 999,
                      minWidth: 104,
                      textTransform: "none",
                      fontWeight: 700,
                    }}
                  >
                    {mode === "dark" ? t("common.light") : t("common.dark")}
                  </Button>
                </Stack>

                <Typography variant="h4" fontWeight={900}>
                  {t("loginPage.title")}
                </Typography>
                <Typography color="text.secondary">
                  {t("loginPage.subtitle")}
                </Typography>

                <TextField
                  fullWidth
                  label={t("loginPage.fullName")}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  type="email"
                  label={t("loginPage.email")}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />

                <FormControl fullWidth>
                  <InputLabel>{t("loginPage.password")}</InputLabel>
                  <OutlinedInput
                    label={t("loginPage.password")}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <LockRoundedIcon fontSize="small" />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword((prev) => !prev)}
                          onMouseDown={(event) => event.preventDefault()}
                        >
                          {showPassword ? (
                            <VisibilityOffRoundedIcon />
                          ) : (
                            <VisibilityRoundedIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <FormControl fullWidth>
                    <InputLabel id="focus-label">
                      {t("loginPage.mainFocus")}
                    </InputLabel>
                    <Select
                      labelId="focus-label"
                      value={focusArea}
                      label={t("loginPage.mainFocus")}
                      onChange={(event) => setFocusArea(event.target.value)}
                    >
                      <MenuItem value="study">
                        {t("loginPage.focus.study")}
                      </MenuItem>
                      <MenuItem value="work">
                        {t("loginPage.focus.work")}
                      </MenuItem>
                      <MenuItem value="health">
                        {t("loginPage.focus.health")}
                      </MenuItem>
                      <MenuItem value="personal">
                        {t("loginPage.focus.personal")}
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <Box
                    sx={{
                      minWidth: 180,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={(event) =>
                            setRememberMe(event.target.checked)
                          }
                        />
                      }
                      label={t("loginPage.rememberMe")}
                    />
                  </Box>
                </Stack>

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LoginRoundedIcon />}
                  onClick={handleLogin}
                  sx={{
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 800,
                    py: 1.1,
                  }}
                >
                  {t("loginPage.continue")}
                </Button>

                <Divider />
                <Typography variant="caption" color="text.secondary">
                  {t("loginPage.note")}
                </Typography>
              </Stack>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
