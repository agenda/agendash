import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import JobPage from "./pages/JobPage";
import OverviewPage from "pages/OverviewPage";
import AuthProvider from "auth/Auth";

export const router = createBrowserRouter(
  [
    {
      element: (
        <AuthProvider>
          <DashboardLayout />
        </AuthProvider>
      ),
      children: [
        { path: "/", element: <OverviewPage /> },
        { path: "/jobs", element: <JobPage /> },
        {
          path: "/login",
          element: <LoginPage />,
        },
      ],
    },
  ],
  {
    basename: "/agenda-dashboard",
  }
);
