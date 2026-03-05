import { useEffect, useMemo, useState } from "react";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function LiveDateTimeCard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { i18n, t } = useTranslation();
  const [now, setNow] = useState(() => new Date());
  const [is24Hour, setIs24Hour] = useState(() => {
    const saved = localStorage.getItem("clock-hour-format");
    return saved ? saved === "24" : true;
  });

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("clock-hour-format", is24Hour ? "24" : "12");
  }, [is24Hour]);

  const locale = i18n.language === "fa" ? "fa-IR" : "en-US";
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    []
  );

  const dayName = useMemo(
    () => now.toLocaleDateString(locale, { weekday: "long" }),
    [now, locale]
  );
  const fullDate = useMemo(
    () =>
      now.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [now, locale]
  );

  const timeParts = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: !is24Hour,
      }).formatToParts(now),
    [now, locale, is24Hour]
  );
  const hour = timeParts.find((item) => item.type === "hour")?.value ?? "--";
  const minute =
    timeParts.find((item) => item.type === "minute")?.value ?? "--";
  const second =
    timeParts.find((item) => item.type === "second")?.value ?? "--";
  const dayPeriod =
    timeParts.find((item) => item.type === "dayPeriod")?.value ?? "";

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: isDark
          ? "0 14px 34px rgba(2,6,23,0.4)"
          : "0 12px 26px rgba(15,23,42,0.08)",
        background: isDark
          ? "linear-gradient(135deg, rgba(30,64,175,0.36), rgba(15,23,42,0.94) 58%)"
          : "linear-gradient(135deg, rgba(37,99,235,0.16), rgba(255,255,255,1) 58%)",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={1.45}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeRoundedIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" color="text.secondary">
                {t("dashboard.liveDateTime")}
              </Typography>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#22c55e",
                  boxShadow: "0 0 0 0 rgba(34,197,94,0.65)",
                  animation: "pulseLive 1.5s ease-out infinite",
                  "@keyframes pulseLive": {
                    "0%": { boxShadow: "0 0 0 0 rgba(34,197,94,0.65)" },
                    "100%": { boxShadow: "0 0 0 8px rgba(34,197,94,0)" },
                  },
                }}
              />
            </Stack>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setIs24Hour((prev) => !prev)}
              sx={{
                minWidth: 58,
                borderRadius: 999,
                fontWeight: 800,
                bgcolor: isDark
                  ? "rgba(30,41,59,0.65)"
                  : "rgba(255,255,255,0.88)",
              }}
            >
              {is24Hour ? "24H" : "12H"}
            </Button>
          </Stack>

          <Stack
            direction="row"
            spacing={0.65}
            alignItems="baseline"
            sx={{
              px: 1.2,
              py: 0.8,
              borderRadius: 2,
              bgcolor: isDark ? "rgba(15,23,42,0.5)" : "rgba(248,250,252,0.78)",
              border: "1px solid",
              borderColor: isDark
                ? "rgba(148,163,184,0.22)"
                : "rgba(15,23,42,0.08)",
            }}
          >
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                lineHeight: 1.05,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: 0.35,
              }}
            >
              {hour}:{minute}
            </Typography>
            <Box
              key={second}
              sx={{
                fontSize: { xs: "1.6rem", sm: "1.75rem" },
                fontWeight: 900,
                lineHeight: 1.05,
                color: "primary.main",
                display: "inline-block",
                animation: "tickIn 220ms ease",
                fontVariantNumeric: "tabular-nums",
                "@keyframes tickIn": {
                  from: {
                    opacity: 0.35,
                    transform: "translateY(2px) scale(0.96)",
                  },
                  to: { opacity: 1, transform: "translateY(0) scale(1)" },
                },
              }}
            >
              :{second}
            </Box>
            {!is24Hour && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 800,
                  mb: 0.4,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {dayPeriod}
              </Typography>
            )}
          </Stack>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.1,
              py: 0.7,
              borderRadius: 1.5,
              bgcolor: isDark
                ? "rgba(15,23,42,0.36)"
                : "rgba(248,250,252,0.72)",
            }}
          >
            <CalendarMonthRoundedIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {dayName}, {fullDate}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.1,
              py: 0.65,
              borderRadius: 1.5,
              bgcolor: isDark
                ? "rgba(15,23,42,0.36)"
                : "rgba(248,250,252,0.72)",
            }}
          >
            <PublicRoundedIcon fontSize="small" color="action" />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              {timezone}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
