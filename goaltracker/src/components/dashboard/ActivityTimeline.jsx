import { Card, CardContent, List, ListItem, Typography } from "@mui/material";

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export default function ActivityTimeline({ goals }) {
  const activities = goals
    .flatMap((goal) =>
      (goal.logs || []).map((log) => ({
        goalTitle: goal.title,
        amount: log.amount,
        date: log.date,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3.5,
        width: "100%",
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          Activity
        </Typography>

        {activities.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            No activity yet.
          </Typography>
        ) : (
          <List sx={{ mt: 1 }}>
            {activities.map((activity, index) => (
              <ListItem
                key={`${activity.goalTitle}-${activity.date}-${index}`}
                sx={{ px: 0, py: 0.75, borderBottom: "1px dashed", borderColor: "divider" }}
              >
                <Typography color="text.secondary">
                  +{activity.amount} on "{activity.goalTitle}" ({formatDate(activity.date)})
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
