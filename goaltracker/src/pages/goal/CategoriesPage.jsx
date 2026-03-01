import { useMemo } from "react";
import { Box, Card, CardContent, Container, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { useGoals } from "../../context/GoalsContext";

export default function CategoriesPage() {
  const { goals } = useGoals();

  const categories = useMemo(() => {
    const map = new Map();
    goals.forEach((goal) => {
      const current = map.get(goal.category) || { name: goal.category, active: 0, completed: 0, total: 0 };
      current.total += 1;
      if (goal.status === "completed") current.completed += 1;
      if (goal.status === "active") current.active += 1;
      map.set(goal.category, current);
    });
    return [...map.values()];
  }, [goals]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>
          Categories
        </Typography>

        {categories.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 3 }}>
            <Typography color="text.secondary">No categories yet. Create your first goal.</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {categories.map((category) => {
              const percent = Math.round((category.completed / category.total) * 100);
              return (
                <Grid item xs={12} sm={6} md={4} key={category.name}>
                  <Card elevation={1} sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700}>
                        {category.name}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Active: {category.active}
                      </Typography>
                      <Typography color="text.secondary">
                        Completed: {category.completed}
                      </Typography>
                      <LinearProgress value={percent} variant="determinate" sx={{ mt: 2, height: 8, borderRadius: 999 }} />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Stack>
    </Container>
  );
}
