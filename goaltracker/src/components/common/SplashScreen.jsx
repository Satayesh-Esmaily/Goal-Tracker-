import { Box, LinearProgress, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import logoImage from "../../assets/logo.jpg";

export default function SplashScreen({ onFinish }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [progress, setProgress] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const titleText = "Goal Tracker";
  const particles = useMemo(
    () => [
      { top: "18%", left: "22%", size: 8, delay: "0ms" },
      { top: "26%", left: "74%", size: 6, delay: "240ms" },
      { top: "64%", left: "18%", size: 7, delay: "420ms" },
      { top: "72%", left: "78%", size: 9, delay: "160ms" },
      { top: "82%", left: "42%", size: 5, delay: "340ms" },
    ],
    []
  );

  useEffect(() => {
    const startTime = Date.now();
    const totalMs = 2600;
    const fadeOutAtMs = 2150;

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(1, elapsed / totalMs);
      setProgress(Math.round(ratio * 100));
      if (elapsed >= fadeOutAtMs) setIsLeaving(true);
      if (elapsed >= totalMs) {
        window.clearInterval(interval);
        onFinish?.();
      }
    }, 16);

    return () => window.clearInterval(interval);
  }, [onFinish]);

  const charDelay = useMemo(
    () => titleText.split("").map((_, idx) => `${idx * 45}ms`),
    [titleText]
  );
  const stageText =
    progress < 25
      ? "Loading your goals..."
      : progress < 55
      ? "Preparing your dashboard..."
      : progress < 85
      ? "Syncing streak and progress..."
      : "Almost ready...";

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        position: "fixed",
        inset: 0,
        zIndex: 1700,
        display: "grid",
        placeItems: "center",
        px: { xs: 1.5, sm: 2 },
        overflow: "hidden",
        bgcolor: isDark ? "#050b14" : "#f3f6fb",
        backgroundImage: isDark
          ? "radial-gradient(1100px 520px at 50% -8%, rgba(25,118,210,0.42), transparent 70%), linear-gradient(140deg, #050b14, #0b1221 45%, #0c1a2f)"
          : "radial-gradient(1000px 480px at 50% -8%, rgba(25,118,210,0.24), transparent 70%), linear-gradient(140deg, #f7f9ff, #edf3fd 45%, #eaf1ff)",
        opacity: isLeaving ? 0 : 1,
        transform: isLeaving ? "scale(1.018)" : "scale(1)",
        transition: "opacity 430ms ease, transform 430ms ease",
      }}
    >
      {particles.map((dot, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            borderRadius: "50%",
            bgcolor: isDark ? "rgba(147,197,253,0.72)" : "rgba(25,118,210,0.5)",
            boxShadow: isDark
              ? "0 0 16px rgba(96,165,250,0.75)"
              : "0 0 14px rgba(25,118,210,0.45)",
            animation: "sparkle 2.5s ease-in-out infinite",
            animationDelay: dot.delay,
            "@keyframes sparkle": {
              "0%,100%": { opacity: 0.25, transform: "translateY(0px) scale(0.95)" },
              "50%": { opacity: 1, transform: "translateY(-8px) scale(1.1)" },
            },
          }}
        />
      ))}

      <Box
        sx={{
          position: "absolute",
          width: { xs: 220, sm: 280, md: 300 },
          height: { xs: 220, sm: 280, md: 300 },
          borderRadius: "50%",
          filter: "blur(28px)",
          top: { xs: "10%", sm: "14%", md: "16%" },
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: isDark ? "rgba(66,165,245,0.22)" : "rgba(25,118,210,0.18)",
          animation: "orbPulse 2.2s ease-in-out infinite",
          "@keyframes orbPulse": {
            "0%": { transform: "scale(0.92)" },
            "100%": { transform: "scale(1.08)" },
          },
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: { xs: 10, sm: 16, md: 24 },
          borderRadius: { xs: 4, sm: 6, md: 8 },
          border: "1px solid",
          borderColor: isDark ? "rgba(148,163,184,0.14)" : "rgba(15,23,42,0.08)",
          background: isDark ? "rgba(15,23,42,0.24)" : "rgba(255,255,255,0.52)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          opacity: 0.9,
        }}
      />

      <Stack
        alignItems="center"
        spacing={{ xs: 1.8, sm: 2.2, md: 2.4 }}
        sx={{ position: "relative", zIndex: 1, px: { xs: 1, sm: 2 }, width: "100%", maxWidth: 560 }}
      >
        <Box
          sx={{
            width: { xs: 84, sm: 102, md: 114 },
            height: { xs: 84, sm: 102, md: 114 },
            borderRadius: { xs: 3, sm: 3.5, md: 4 },
            p: { xs: 0.6, sm: 0.75, md: 0.85 },
            position: "relative",
            bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)",
            border: "1px solid",
            borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(15,23,42,0.12)",
            boxShadow: isDark ? "0 24px 56px rgba(25,118,210,0.38)" : "0 22px 50px rgba(25,118,210,0.25)",
            animation: "tileFloat 2.1s ease-in-out infinite alternate",
            "@keyframes tileFloat": {
              from: { transform: "translateY(0px)" },
              to: { transform: "translateY(-4px)" },
            },
            "&::before": {
              content: '""',
              position: "absolute",
              inset: -7,
              borderRadius: 5,
              border: "1px solid",
              borderColor: isDark ? "rgba(66,165,245,0.35)" : "rgba(25,118,210,0.32)",
              opacity: 0.9,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: -13,
              borderRadius: 6.5,
              background: "conic-gradient(from 120deg, rgba(66,165,245,0.05), rgba(66,165,245,0.68), rgba(66,165,245,0.05))",
              filter: "blur(0.2px)",
              animation: "spinRing 2.4s linear infinite",
              "@keyframes spinRing": {
                from: { transform: "rotate(0deg)" },
                to: { transform: "rotate(360deg)" },
              },
            },
          }}
        >
          <Box
            component="img"
            src={logoImage}
            alt="Goal Tracker Logo"
            sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 2.2 }}
          />
        </Box>

        <Stack
          direction="row"
          sx={{
            fontSize: { xs: 30, sm: 36, md: 44 },
            fontWeight: 900,
            lineHeight: 1,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {titleText.split("").map((ch, idx) => (
            <Box
              key={`${ch}-${idx}`}
              component="span"
              sx={{
                color: isDark ? "#dbeafe" : "#0f172a",
                opacity: 0,
                transform: "translateY(8px)",
                animation: "charIn 460ms ease forwards",
                animationDelay: charDelay[idx],
                "@keyframes charIn": {
                  to: { opacity: 1, transform: "translateY(0px)" },
                },
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </Box>
          ))}
        </Stack>

        <Typography
          variant="body2"
          sx={{
            color: isDark ? "rgba(203,213,225,0.9)" : "rgba(51,65,85,0.9)",
            textAlign: "center",
            maxWidth: { xs: 290, sm: 500 },
            fontSize: { xs: "0.86rem", sm: "0.98rem" },
            px: { xs: 0.5, sm: 0 },
          }}
        >
          Build consistency, ship progress, and protect your streak every day.
        </Typography>

        <Box sx={{ width: { xs: "min(92vw, 280px)", sm: 300 }, mt: 0.5 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 7,
              borderRadius: 999,
              bgcolor: isDark ? "rgba(148,163,184,0.22)" : "rgba(15,23,42,0.12)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background: "linear-gradient(90deg, #42a5f5, #1976d2)",
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              mt: 0.75,
              display: "block",
              textAlign: "center",
              color: isDark ? "rgba(148,163,184,0.9)" : "rgba(71,85,105,0.9)",
              letterSpacing: 0.35,
            }}
          >
            {stageText} {progress}%
          </Typography>
        </Box>

      </Stack>
    </Box>
  );
}
