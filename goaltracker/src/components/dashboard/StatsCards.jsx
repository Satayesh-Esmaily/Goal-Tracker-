import { Grid, Card, CardContent, Typography } from "@mui/material";

export default function StatsCards({ stats }) {
  const items = [
    { title: "Active Goals", value: stats.activeCount },
    { title: "Completed Goals", value: stats.completedCount },
    { title: "Current Streak", value: `${stats.streak} days` },
    { title: "Total XP", value: stats.xpTotal },
  ];

  return (
    <Grid container spacing={2} alignItems="stretch">

      {items.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.title} sx={{ display: "flex" }}>
          <Card
            elevation={0}
            sx={{
              width: "100%",
              display: "flex",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 1,
              }}
            >

              <Typography color="text.secondary" variant="body2">
                {stat.title}
              </Typography>

              <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.1 }}>
                {stat.value}
              </Typography>

            </CardContent>
          </Card>
        </Grid>
      ))}

    </Grid>
  );
}
