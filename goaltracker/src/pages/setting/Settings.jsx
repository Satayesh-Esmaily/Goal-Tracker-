import { Box, Typography, Button, Stack, Switch, FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";

function Settings({ currentTheme, toggleTheme }) {
  const { t, i18n } = useTranslation();

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {t("nav.settings")}
      </Typography>

      <Stack direction="row" spacing={2} mb={3}>
        <Button
          variant="contained"
          onClick={() => i18n.changeLanguage(i18n.language === "fa" ? "en" : "fa")}
        >
          {i18n.language === "fa" ? "EN" : "FA"}
        </Button>

        <FormControlLabel
          control={
            <Switch
              checked={currentTheme === "dark"}
              onChange={toggleTheme}
            />
          }
          label={t(currentTheme === "dark" ? "common.dark" : "common.light")}
        />
      </Stack>
    </Box>
  );
}

export default Settings;
