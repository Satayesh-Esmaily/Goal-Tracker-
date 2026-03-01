import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import Settings from "../pages/Settings"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "settings", 
        element: <Settings currentTheme={"light"} toggleTheme={() => {}} />, 
      },
    ],
  },
]);