import { Tab, Tabs } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function GoalsFilterTabs({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <Tabs value={value} onChange={(_, nextValue) => onChange(nextValue)} variant="scrollable">
      <Tab label={t("goalsPage.tabs.all")} value="all" />
      <Tab label={t("goalsPage.tabs.active")} value="active" />
      <Tab label={t("goalsPage.tabs.completed")} value="completed" />
      <Tab label={t("goalsPage.tabs.paused")} value="paused" />
    </Tabs>
  );
}

