import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    direction: "ltr",
    palette: {
      mode,
      primary: {
        main: "#1976d2",
        light: "#42a5f5",
        dark: "#115293",
      },
      secondary: { main: "#9c27b0" },
      background: {
        default: mode === "dark" ? "#0f172a" : "#f6f8fb",
        paper: mode === "dark" ? "#111827" : "#ffffff",
      },
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: 'var(--app-font, "Inter","Roboto","Helvetica","Arial",sans-serif)',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
      },
    },
  });
