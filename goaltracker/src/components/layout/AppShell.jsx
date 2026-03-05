import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  IconButton,
  InputBase,
  Stack,
  Toolbar,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import GitHubIcon from "@mui/icons-material/GitHub";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import logoImage from "../../assets/logo.jpg";
import { useAuth } from "../../context/AuthContext";

function AppShell({ children, mode, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isFa = i18n.language === "fa";

  useEffect(() => {
    const direction = i18n.language === "fa" ? "rtl" : "ltr";
    const fontFamily =
      i18n.language === "fa"
        ? '"Vazirmatn","Tahoma","Segoe UI",sans-serif'
        : '"Inter","Roboto","Helvetica","Arial",sans-serif';
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
    document.documentElement.style.setProperty("--app-font", fontFamily);
    document.body.dir = direction;
  }, [i18n.language]);

  const links = [
    { label: t("nav.dashboard"), to: "/" },
    { label: t("nav.goals"), to: "/goals" },
    { label: t("nav.archive"), to: "/archive" },
    { label: t("nav.categories"), to: "/categories" },
    { label: t("nav.settings"), to: "/settings" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isDark ? "#050b14" : "#f3f6fb",
        backgroundImage: isDark
          ? "radial-gradient(900px 420px at 75% 0%, rgba(25,118,210,0.2), transparent 70%)"
          : "radial-gradient(900px 420px at 75% 0%, rgba(25,118,210,0.12), transparent 70%)",
      }}
    >
      <CssBaseline />

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: isDark ? alpha("#050b14", 0.9) : alpha("#ffffff", 0.9),
          borderBottom: "1px solid",
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ minHeight: 72, gap: 2 }}>
          <IconButton
            sx={{ display: { md: "none" }, color: isDark ? "#cbd5e1" : "#334155" }}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <MenuIcon />
          </IconButton>

          <Stack
            direction="row"
            alignItems="center"
            gap={1.5}
            sx={{
              mr: isFa ? 2 : 1,
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={logoImage}
              alt="Goal Tracker Logo"
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                objectFit: "cover",
                border: "1px solid",
                borderColor: isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(15,23,42,0.15)",
              }}
            />

            <Box
              sx={{
                color: isDark ? "#e2e8f0" : "#1e293b",
                fontWeight: 700,
                fontSize: { xs: 18, sm: 20 },
                whiteSpace: "nowrap",
              }}
            >
              {isFa ? "Goal Tracker" : "Goal Tracker"}
            </Box>
          </Stack>

          <Stack direction="row" spacing={isFa ? 1.35 : 0.5} sx={{ display: { xs: "none", md: "flex" } }}>
            {links.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                sx={{
                  color: isDark ? "#cbd5e1" : "#334155",
                  fontWeight: 600,
                  px: isFa ? 2.5 : 1.5,
                  py: 1,
                  borderRadius: 2,
                  "&.active": {
                    color: isDark ? "#fff" : "#0f172a",
                    bgcolor: isDark ? "rgba(30,136,229,0.2)" : "rgba(30,136,229,0.14)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              px: 1.5,
              py: 0.5,
              borderRadius: 999,
              border: "1px solid",
              borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.12)",
              bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.04)",
              width: 280,
            }}
          >
            <SearchIcon sx={{ color: "#60a5fa", fontSize: 20 }} />
            <InputBase
              placeholder={t("nav.search")}
              sx={{ ml: 1, color: isDark ? "#e2e8f0" : "#0f172a", flex: 1 }}
            />
            <Box sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 12, fontWeight: 700 }}>
              Ctrl+K
            </Box>
          </Box>

          <Tooltip title={t("nav.language")}>
            <IconButton
              sx={{ color: isDark ? "#cbd5e1" : "#334155" }}
              onClick={() => i18n.changeLanguage(i18n.language === "fa" ? "en" : "fa")}
            >
              <TranslateOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t("nav.theme")}>
            <IconButton sx={{ color: isDark ? "#cbd5e1" : "#334155" }} onClick={toggleTheme}>
              {mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title={t("nav.github")}>
            <IconButton
              component="a"
              href="https://github.com/Satayesh-Esmaily/Goal-Tracker-"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: isDark ? "#cbd5e1" : "#334155" }}
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton sx={{ color: isDark ? "#cbd5e1" : "#334155" }} onClick={logout}>
              <LogoutRoundedIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>

        {mobileOpen && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              px: 2,
              pb: 1.5,
              overflowX: "auto",
              display: { md: "none" },
            }}
          >
            {links.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                sx={{
                  color: isDark ? "#cbd5e1" : "#334155",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.14)" : "rgba(15,23,42,0.14)"}`,
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  "&.active": {
                    color: isDark ? "#fff" : "#0f172a",
                    borderColor: "#1e88e5",
                    bgcolor: isDark ? "rgba(30,136,229,0.2)" : "rgba(30,136,229,0.14)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        )}
      </AppBar>

      <Box component="main" sx={{ width: "100%", px: 0, pb: 4, display: "block" }}>
        {children}
      </Box>
    </Box>
  );
}

export { AppShell };
export default AppShell;

