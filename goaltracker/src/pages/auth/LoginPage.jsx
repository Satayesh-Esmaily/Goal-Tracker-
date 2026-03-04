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
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const { isAuthenticated, loginFake } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusArea, setFocusArea] = useState("study");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const displayName = useMemo(() => String(name || "").trim(), [name]);
  const from = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async () => {
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (password.trim().length < 4) {
      setError("Password should be at least 4 characters.");
      return;
    }

    try {
      await loginFake(displayName);
      navigate(from, { replace: true });
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        bgcolor: "background.default",
        backgroundImage: isDark
          ? `radial-gradient(900px 360px at 80% 10%, ${alpha(primary, 0.2)}, transparent 70%)`
          : `radial-gradient(900px 360px at 80% 10%, ${alpha(primary, 0.12)}, transparent 70%)`,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 880,
          border: "1px solid",
          borderColor: alpha(primary, 0.32),
          borderRadius: 4,
          overflow: "hidden",
          background: isDark
            ? `linear-gradient(140deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(
                theme.palette.background.paper,
                0.82
              )})`
            : `linear-gradient(140deg, #ffffff, ${alpha("#f8fafc", 0.92)})`,
          boxShadow: isDark ? "0 24px 48px rgba(2,6,23,0.46)" : "0 20px 40px rgba(15,23,42,0.12)",
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
                  ? `linear-gradient(145deg, ${alpha(primary, 0.28)}, ${alpha("#0f172a", 0.86)})`
                  : `linear-gradient(145deg, ${alpha(primary, 0.16)}, ${alpha("#e2e8f0", 0.56)})`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight={900}>
                  Goal Tracker
                </Typography>
                <Typography sx={{ mt: 1, opacity: 0.86 }}>
                  Sign in to access your goals, streak, XP, and archive.
                </Typography>
              </Box>

              <Stack spacing={1}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Create and edit goals
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Track progress and streak
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Restore completed and deleted goals
                </Typography>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2}>
                <Typography variant="h4" fontWeight={900}>
                  Welcome Back
                </Typography>
                <Typography color="text.secondary">
                  Log in to continue your Goal Tracker journey.
                </Typography>

                <TextField
                  fullWidth
                  label="Full name"
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
                  label="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />

                <FormControl fullWidth>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput
                    label="Password"
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
                          {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <FormControl fullWidth>
                    <InputLabel id="focus-label">Main focus</InputLabel>
                    <Select
                      labelId="focus-label"
                      value={focusArea}
                      label="Main focus"
                      onChange={(event) => setFocusArea(event.target.value)}
                    >
                      <MenuItem value="study">Study</MenuItem>
                      <MenuItem value="work">Work</MenuItem>
                      <MenuItem value="health">Health</MenuItem>
                      <MenuItem value="personal">Personal</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ minWidth: 180, display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={(event) => setRememberMe(event.target.checked)}
                        />
                      }
                      label="Remember me"
                    />
                  </Box>
                </Stack>

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LoginRoundedIcon />}
                  onClick={handleLogin}
                  sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 800, py: 1.1 }}
                >
                  Continue to Dashboard
                </Button>

                <Divider />
                <Typography variant="caption" color="text.secondary">
                  Note: This is a demo login flow for the Goal Tracker project.
                </Typography>
              </Stack>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
