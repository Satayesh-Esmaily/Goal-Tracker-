import { createBrowserRouter } from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import Settings from "../pages/Settings";
import GoalsPage from "../pages/GoalsPage"; 
import NewGoalPage from "../pages/NewGoalPage"; 
import GoalDetailsPage from "../pages/GoalDetailsPage"; 
import CategoriesPage from "../pages/CategoriesPage"; 
import NotFoundPage from "../pages/NotFoundPage"; 


import DashboardLayout from "../layouts/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true, 
        element: <DashboardPage />,
      },
      {
        path: "goals", 
        element: <GoalsPage />,
      },
      {
        path: "goals/new",
        element: <NewGoalPage />,
      },
      {
        path: "goals/:id", 
        element: <GoalDetailsPage />,
      },
      {
        path: "categories", 
        element: <CategoriesPage />,
      },
      {
        path: "settings", 
        element: <Settings />,
      },
      {
        path: "*", 
        element: <NotFoundPage />,
      },
    ],
  },
]);