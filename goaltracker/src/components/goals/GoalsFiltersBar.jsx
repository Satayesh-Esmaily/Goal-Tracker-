import { MenuItem, Stack, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function GoalsFiltersBar({
  search,
  sortBy,
  onSearchChange,
  onSortByChange,
  isFa,
}) {
  const { t } = useTranslation();
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => onSearchChange(localSearch), 300);
    return () => clearTimeout(timeout);
  }, [localSearch]);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={isFa ? 4 : 2}
      sx={{ mb: 2 }}
    >
      <TextField
        fullWidth
        label={t("goalsPage.searchByTitle")}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
      <TextField
        select
        label={t("goalsPage.sortBy")}
        sx={{ minWidth: 220 }}
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
      >
        <MenuItem value="newest">{t("goalsPage.newest")}</MenuItem>
        <MenuItem value="progress">{t("goalsPage.progress")}</MenuItem>
        <MenuItem value="category">{t("goalsPage.category")}</MenuItem>
      </TextField>
    </Stack>
  );
}
