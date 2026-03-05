import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "70%", md: "50%" },
          textAlign: "center",
          p: 6,
          borderRadius: 3,
          bgcolor: "background.paper",
          boxShadow: 8,
          mx: "auto",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography
            variant="h1"
            fontWeight={900}
            sx={{
              background: "linear-gradient(90deg, #FF512F, #DD2476)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            404
          </Typography>

          <Typography variant="h5" color="text.secondary">
            {t("notFound.title")}
          </Typography>

          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              fontWeight: 700,
              fontSize: "1rem",
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "white",
              textTransform: "none",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "primary.dark",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
              },
            }}
          >
            {t("notFound.goHome")}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
