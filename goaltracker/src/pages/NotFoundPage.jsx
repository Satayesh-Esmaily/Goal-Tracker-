import { Button, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h3" fontWeight={700}>
          404
        </Typography>
        <Typography color="text.secondary">Page not found.</Typography>
        <Button component={RouterLink} to="/" variant="contained">
          Go Home
        </Button>
      </Stack>
    </Container>
  );
}
