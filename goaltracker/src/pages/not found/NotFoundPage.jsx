import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "calc(100vh - 84px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 1.5, sm: 2.5, md: 4 },
        py: { xs: 2, sm: 3.5 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "min(100%, 860px)",
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: { xs: 4, md: 5 },
          border: "1px solid",
          borderColor: isDark ? "rgba(148,163,184,0.24)" : "rgba(15,23,42,0.12)",
          background: isDark
            ? "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(2,6,23,0.86))"
            : "linear-gradient(145deg, rgba(255,255,255,0.94), rgba(248,250,252,0.92))",
          boxShadow: isDark
            ? "0 30px 80px rgba(0,0,0,0.38)"
            : "0 30px 80px rgba(15,23,42,0.15)",
          backdropFilter: "blur(6px)",
          mx: "auto",
          "&::before": {
            content: '""',
            position: "absolute",
            width: { xs: 180, sm: 240 },
            height: { xs: 180, sm: 240 },
            top: { xs: -70, sm: -90 },
            right: { xs: -70, sm: -80 },
            borderRadius: "50%",
            background: alpha(theme.palette.primary.main, isDark ? 0.28 : 0.2),
            filter: "blur(6px)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            width: { xs: 160, sm: 220 },
            height: { xs: 160, sm: 220 },
            bottom: { xs: -75, sm: -95 },
            left: { xs: -60, sm: -80 },
            borderRadius: "50%",
            background: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.12),
            filter: "blur(8px)",
          },
        }}
      >
        <Stack spacing={3.5} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
          <Chip
            icon={<ErrorOutlineRoundedIcon sx={{ fontSize: 18 }} />}
            label="404 Error"
            sx={{
              fontWeight: 700,
              px: 0.5,
              bgcolor: isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.12)",
              color: isDark ? "#fecaca" : "#b91c1c",
              border: "1px solid",
              borderColor: isDark ? "rgba(248,113,113,0.45)" : "rgba(220,38,38,0.3)",
            }}
          />

          <Typography
            variant="h1"
            fontWeight={900}
            sx={{
              fontSize: { xs: "4.3rem", sm: "6.3rem", md: "7.4rem" },
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
              WebkitBackgroundClip: "text",
              color: "transparent",
              textShadow: isDark ? "0 8px 28px rgba(59,130,246,0.32)" : "none",
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            fontWeight={800}
            textAlign="center"
            sx={{ fontSize: { xs: "1.45rem", sm: "2rem" } }}
          >
            {t("notFound.title")}
          </Typography>

          <Typography
            color="text.secondary"
            textAlign="center"
            sx={{
              maxWidth: 560,
              fontSize: { xs: "0.98rem", sm: "1.05rem" },
              mt: -1,
            }}
          >
            The page you are trying to open does not exist or has been moved.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.4}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              size="large"
              startIcon={<HomeRoundedIcon />}
              sx={{
                px: { xs: 3, sm: 4 },
                py: 1.25,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 800,
              }}
            >
              {t("notFound.goHome")}
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => window.history.back()}
              sx={{
                px: { xs: 3, sm: 4 },
                py: 1.25,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 800,
              }}
            >
              Go Back
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
