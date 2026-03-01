import { MenuItem, Stack, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function GoalsFiltersBar({ search, sortBy, onSearchChange, onSortByChange, isFa }) {
  const { t } = useTranslation();

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={isFa ? 4 : 2}>
      <TextField
        fullWidth
        label={t("goalsPage.searchByTitle")}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <TextField
        select
        label={t("goalsPage.sortBy")}
        sx={{ minWidth: 220 }}
        value={sortBy}
        onChange={(event) => onSortByChange(event.target.value)}
      >
        <MenuItem value="newest">{t("goalsPage.newest")}</MenuItem>
        <MenuItem value="progress">{t("goalsPage.progress")}</MenuItem>
        <MenuItem value="category">{t("goalsPage.category")}</MenuItem>
      </TextField>
    </Stack>
  );
}
