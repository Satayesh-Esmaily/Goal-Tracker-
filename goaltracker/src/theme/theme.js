import { createTheme } from "@mui/material/styles";

export const getTheme = (mode, direction = "ltr", primaryColor = "blue") => {
  const colorMap = {
    blue: "#1976d2",
    green: "#2e7d32",
    purple: "#7b1fa2",
    pink: "#c2185b",
  };

  return createTheme({
    direction,
    palette: {
      mode,
      primary: { main: colorMap[primaryColor] },
      secondary: { main: "#9c27b0" },
      background: {
        default: mode === "dark" ? "#0f172a" : "#f6f8fb",
        paper: mode === "dark" ? "#111827" : "#ffffff",
      },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily:
        'var(--app-font, "Inter","Roboto","Helvetica","Arial",sans-serif)',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
    },
    components: {
      MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiButton: { defaultProps: { disableElevation: true } },
    },
  });
};
