import { Card, CardContent, Stack, Typography } from "@mui/material";

export default function SectionCard({ title, action, children, sx, contentSx }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
        ...sx,
      }}
    >
      <CardContent sx={{ p: 2.5, ...contentSx }}>
        {(title || action) && (
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={800}>
              {title}
            </Typography>
            {action}
          </Stack>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

