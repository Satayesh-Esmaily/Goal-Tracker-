import DashboardIcon from "@mui/icons-material/Dashboard";
import FlagIcon from "@mui/icons-material/Flag";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";
import { AppBar, Toolbar, Typography, Button, Stack, Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

function Navbar() {
  const { t, i18n } = useTranslation();


  useEffect(() => {
    document.body.dir = i18n.language === "fa" ? "rtl" : "ltr";
  }, [i18n.language]);

  const activeStyle = {
    textDecoration: "underline",
    color: "#FFD700",
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: i18n.language === "fa" ? "row-reverse" : "row",
        }}
      >

        <Typography variant="h6">Goal Tracker</Typography>


        <Stack direction="row" spacing={2}>
          <Button
  color="inherit"
  component={NavLink}
  to="/"
  startIcon={<DashboardIcon />}
  style={({ isActive }) => (isActive ? activeStyle : undefined)}
>
  {t("dashboard")}
</Button>

<Button
  color="inherit"
  component={NavLink}
  to="/goals"
  startIcon={<FlagIcon />}
  style={({ isActive }) => (isActive ? activeStyle : undefined)}
>
  {t("goals")}
</Button>

<Button
  color="inherit"
  component={NavLink}
  to="/categories"
  startIcon={<CategoryIcon />}
  style={({ isActive }) => (isActive ? activeStyle : undefined)}
>
  {t("categories")}
</Button>

<Button
  color="inherit"
  component={NavLink}
  to="/settings"
  startIcon={<SettingsIcon />}
  style={({ isActive }) => (isActive ? activeStyle : undefined)}
>
  {t("settings")}
</Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;