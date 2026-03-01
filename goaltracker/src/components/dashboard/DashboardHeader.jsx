import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function DashboardHeader({ toggleTheme }) {
  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>

      <CardContent sx={{ p: { xs: 2, md: 3 } }}>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >

          <Stack spacing={0.5}>
            <Typography variant="h4" fontWeight={800}>
              Goal Tracker Dashboard
            </Typography>
            <Typography color="text.secondary">
              Track your goals, streak, and XP in one place.
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button variant="contained" component={RouterLink} to="/goals/new" size="medium">
              + New Goal
            </Button>
            <Button variant="outlined" component={RouterLink} to="/goals" size="medium">
              View All Goals
            </Button>
            <Button variant="text" onClick={toggleTheme} size="medium">
              Toggle Theme
            </Button>
          </Stack>

        </Stack>

      </CardContent>

    </Card>
  );
}
