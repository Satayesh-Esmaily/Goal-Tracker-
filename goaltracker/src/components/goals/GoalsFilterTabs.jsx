import { Tabs, Tab, Box } from "@mui/material";

export default function GoalsFilterTabs({ value, onChange }) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
      <Tabs
        value={value}
        onChange={(e, newValue) => onChange(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="All" value="all" />
        <Tab label="Active" value="active" />
        <Tab label="Paused" value="paused" />
        <Tab label="Completed" value="completed" />
      </Tabs>
    </Box>
  );
}
