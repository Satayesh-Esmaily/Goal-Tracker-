import { Card, CardContent, Typography, List, ListItem } from "@mui/material";

export default function RecentGoals({ goals }) {
  const completed = goals.filter((goal) => goal.status === "completed").slice(0, 5);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3.5,
        border: "1px solid",
        borderColor: "divider",
      }}
    >

      <CardContent sx={{ p: 3 }}>

        <Typography variant="h6" fontWeight={700}>
          Completed Goals Preview
        </Typography>

        {completed.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            No completed goals yet.
          </Typography>
        ) : (
          <List sx={{ mt: 1 }}>
            {completed.map((goal) => (
              <ListItem key={goal.id} sx={{ px: 0, py: 0.75 }}>
                {goal.title}
              </ListItem>
            ))}
          </List>
        )}

      </CardContent>

    </Card>
  );
}

