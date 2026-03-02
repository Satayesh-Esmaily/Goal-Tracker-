import { Container, Grid } from "@mui/material";
import HeroSection from "../components/dashboard/HeroSection";
import TaskCard from "../components/dashboard/TaskCard";
import CalendarWidget from "../components/dashboard/CalendarWidget";

export default function DashboardPage() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      
      <Grid container spacing={3}>

        <Grid item xs={12} md={7}>
          <HeroSection />
        </Grid>

        <Grid item xs={12} md={5}>
          <TaskCard />
        </Grid>

        <Grid item xs={12} md={7}>
          <CalendarWidget />
        </Grid>

      </Grid>

    </Container>
  );
}
