import { Box, Typography, Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function EmptyState({ message, onAction, actionLabel }) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        py: 8,
        textAlign: "center",
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(15,23,42,0.8)"
            : "rgba(248,250,252,0.6)",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <AddCircleOutlineIcon sx={{ fontSize: 60, color: "primary.main" }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {message || t("common.noItems")}
        </Typography>
        {onAction && actionLabel && (
          <Button
            variant="contained"
            onClick={onAction}
            startIcon={<AddCircleOutlineIcon />}
            sx={{ mt: 1, textTransform: "none", fontWeight: 700 }}
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
