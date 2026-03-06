import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

export default function MetricCard({ title, value, icon, color, subtitle }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          insetInlineStart: 0,
          top: 0,
          width: "100%",
          height: 3,
          bgcolor: color,
        }}
      />
      <CardContent sx={{ p: 2.25 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                mt: 0.5,
                lineHeight: 1.1,
                fontSize: { xs: "2rem", sm: "2.2rem" },
              }}
            >
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              width: { xs: 34, sm: 38 },
              height: { xs: 34, sm: 38 },
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: color,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
