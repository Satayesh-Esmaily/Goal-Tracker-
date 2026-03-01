import { useState } from "react";
import {
  AppBar,
  Avatar,
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
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function AppShell({ children, mode, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    const direction = i18n.language === "fa" ? "rtl" : "ltr";
    document.documentElement.dir = direction;
    document.body.dir = direction;
  }, [i18n.language]);

  const links = [
    { label: t("dashboard"), to: "/" },
    { label: t("goals"), to: "/goals" },
    { label: t("categories"), to: "/categories" },
    { label: t("settings"), to: "/settings" },
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

          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mr: 1 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                background: "linear-gradient(135deg, #1e88e5, #1565c0)",
              }}
            />
            <Box sx={{ color: isDark ? "#e2e8f0" : "#1e293b", fontWeight: 700, fontSize: 22, lineHeight: 1 }}>
              GT
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ display: { xs: "none", md: "flex" } }}>
            {links.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                sx={{
                  color: isDark ? "#cbd5e1" : "#334155",
                  fontWeight: 600,
                  px: 1.5,
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
              placeholder="Search..."
              sx={{ ml: 1, color: isDark ? "#e2e8f0" : "#0f172a", flex: 1 }}
            />
            <Box sx={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 12, fontWeight: 700 }}>
              Ctrl+K
            </Box>
          </Box>

          <Tooltip title="Language">
            <IconButton
              sx={{ color: isDark ? "#cbd5e1" : "#334155" }}
              onClick={() => i18n.changeLanguage(i18n.language === "fa" ? "en" : "fa")}
            >
              <TranslateOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Theme">
            <IconButton sx={{ color: isDark ? "#cbd5e1" : "#334155" }} onClick={toggleTheme}>
              {mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="GitHub">
            <IconButton sx={{ color: isDark ? "#cbd5e1" : "#334155" }}>
              <GitHubIcon />
            </IconButton>
          </Tooltip>

          <Avatar sx={{ width: 34, height: 34, bgcolor: "#1e88e5", fontSize: 14 }}>GT</Avatar>
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
