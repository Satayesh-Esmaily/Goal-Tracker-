import { useState, useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { router } from "./routes/router";

function App() {
  const [themeMode, setThemeMode] = useState("light");
  const [direction, setDirection] = useState("ltr");

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: themeMode },
        direction: direction,
      }),
    [themeMode, direction]
  );

  const toggleTheme = () =>
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));

  const toggleDirection = (lang) => setDirection(lang === "fa" ? "rtl" : "ltr");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
