import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProviderCustom = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem("themeMode") || "dark");
  const [primaryColor, setPrimaryColor] = useState(
    localStorage.getItem("primaryColor") || "blue"
  );

  const toggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
    localStorage.setItem("primaryColor", primaryColor);
  }, [mode, primaryColor]);

  return (
    <ThemeContext.Provider
      value={{ mode, toggleMode, primaryColor, setPrimaryColor }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
