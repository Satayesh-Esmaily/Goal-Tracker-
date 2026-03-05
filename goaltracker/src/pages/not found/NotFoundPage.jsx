import { Button, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    // Fallback page for unknown routes.
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h4" fontWeight={800}>
          404
        </Typography>
        <Typography color="text.secondary">{t("notFound.title")}</Typography>
        <Button component={RouterLink} to="/" variant="contained">
          {t("notFound.goHome")}
        </Button>
      </Stack>
    </Container>
  );
}

