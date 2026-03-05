import { useMemo, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { getTheme } from "./theme/theme";
import { GoalsProvider } from "./context/GoalsContext";
import SplashScreen from "./components/common/SplashScreen";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

import { ThemeProviderCustom, useTheme } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProviderCustom>
      <AppInner />
    </ThemeProviderCustom>
  );
}

function AppInner() {
  const { mode, toggleMode, primaryColor, setPrimaryColor } = useTheme();
  const { i18n } = useTranslation();

  const [showSplash, setShowSplash] = useState(true);

  const direction = i18n.language === "fa" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  const theme = useMemo(
    () => getTheme(mode, direction, primaryColor),
    [mode, direction, primaryColor]
  );

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <GoalsProvider>
          <AppRoutes
            mode={mode}
            toggleMode={toggleMode}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
          />
        </GoalsProvider>
      </AuthProvider>

      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
    </ThemeProvider>
  );
}
