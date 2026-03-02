import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import Settings from "../pages/Settings"; 

// Alternative router config (kept for setups that use createBrowserRouter).
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        // Default child route.
        index: true,
        element: <DashboardPage />,
      },
      {
        // Settings page route.
        path: "settings", 
        element: <Settings currentTheme={"light"} toggleTheme={() => {}} />, 
      },
    ],
  },
]);
