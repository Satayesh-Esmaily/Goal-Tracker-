import { Box, LinearProgress, Stack, Typography, alpha, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function AuthLoadingScreen() {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;
  const isFa = i18n.language === "fa";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        bgcolor: isDark ? "#050b14" : "#f3f6fb",
        backgroundImage: isDark
          ? `radial-gradient(900px 400px at 70% 8%, ${alpha(primary, 0.24)}, transparent 70%)`
          : `radial-gradient(900px 400px at 70% 8%, ${alpha(primary, 0.14)}, transparent 70%)`,
      }}
    >
      <Stack spacing={2} alignItems="center" sx={{ width: "100%", px: 2 }}>
        <Box
          sx={{
            width: { xs: 220, sm: 260 },
          }}
        >
          <LinearProgress
            sx={{
              height: 6,
              borderRadius: 999,
              bgcolor: isDark ? "rgba(148,163,184,0.24)" : "rgba(15,23,42,0.12)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background: `linear-gradient(90deg, ${alpha(primary, 0.72)}, ${primary})`,
              },
            }}
          />
        </Box>

        <Typography fontWeight={800} 
           variant="body2"
          textAlign="center"
          sx={{
            mt: -0.5,
            color: isDark ? "rgba(226,232,240,0.9)" : "text.secondary",
          }}>
          {isFa ? "لودینگ داشبورد..." : "Loading Dashboard..."}
          
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          sx={{
            mt: -0.5,
            color: isDark ? "rgba(226,232,240,0.9)" : "text.secondary",
          }}
        >
          {isFa ? "لطفاً چند لحظه صبر کنید" : "Please wait a moment"}
        </Typography>
      </Stack>
    </Box>
  );
}
