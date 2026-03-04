import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
  confirmColor = "error",
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: isDark ? "rgba(15,23,42,0.95)" : "#fff",
          color: isDark ? "#f8fafc" : "#0f172a",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        {description && (
          <Typography
            variant="body2"
            sx={{ color: isDark ? "#cbd5e1" : "#475569" }}
          >
            {description}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onCancel}
          sx={{
            textTransform: "none",
            color: isDark ? "#94a3b8" : "#64748b",
            "&:hover": {
              backgroundColor: isDark
                ? "rgba(148,163,184,0.08)"
                : "rgba(226,232,240,0.5)",
            },
          }}
        >
          {t("common.cancel")}
        </Button>
        <Button
          color={confirmColor}
          variant="contained"
          onClick={onConfirm}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            "&:hover": {
              backgroundColor:
                confirmColor === "error"
                  ? isDark
                    ? "rgba(248,113,113,0.8)"
                    : "#dc2626"
                  : undefined,
            },
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
