import { Card, CardContent, Typography, LinearProgress } from "@mui/material";

export default function GoalsProgress({ stats }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3.5,
        width: "100%",
        border: "1px solid",
        borderColor: "divider",
      }}
    >

      <CardContent sx={{ p: 3 }}>

        <Typography variant="h6" fontWeight={700}>
          Overall Progress
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {stats.completionRate}% complete across all goals
        </Typography>

        <Typography variant="h3" fontWeight={800} sx={{ mt: 2, lineHeight: 1 }}>
          {stats.completionRate}%
        </Typography>

        <LinearProgress
          variant="determinate"
          value={stats.completionRate}
          sx={{ mt: 2, height: 10, borderRadius: 999, bgcolor: "action.hover" }}
        />

      </CardContent>

    </Card>
  );
}
