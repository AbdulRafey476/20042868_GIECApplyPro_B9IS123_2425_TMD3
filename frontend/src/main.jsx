import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import store from "./store.js";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import DashboardScreen from "./screens/DashboardScreen.jsx";
import BranchScreen from "./screens/BrancheScreen.jsx";
import AddUserScreen from "./screens/AddUserScreen.jsx";
import UserScreen from "./screens/UserScreen.jsx";
import AddBranch from "./components/AddBranch.jsx";
import AddConsultantScreen from "./screens/consultant/AddConsultantScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import UpdateUserScreen from "./screens/UpdateUserScreen.jsx";
import UpdateBranchScreen from "./screens/UpdateBranchScreen.jsx";
import UpdateConsultant from "./screens/consultant/UpdateConsultant.jsx";
import ConsultantScreen from "./screens/consultant/ConsultantScreen.jsx";
import ErrorPage from "./error-page.jsx";
import StudentScreen from "./screens/student/StudentsScreen.jsx";
import AddStudentScreen from "./screens/student/AddStudentScreen.jsx";
import PaymentScreen from "./screens/payments/PaymentScreen.jsx";
import ChartScreen from "./charts/ChartScreen.jsx";
import Transactions from "./screens/Transactions.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LoginScreen />,
      },
      {
        path: "",
        element: <PrivateRoute />,
        children: [
          {
            path: "dashboard",
            element: <DashboardScreen />,
            children: [
              { path: "", element: <ChartScreen /> },
              {
                path: "branches",
                element: <BranchScreen />,
                children: [
                  {
                    path: "add",
                    element: <AddBranch />,
                  },
                  {
                    path: "update/:id",
                    element: <UpdateBranchScreen />,
                  },
                ]
              },
              {
                path: "users",
                element: <UserScreen />,
                children: [
                  {
                    path: "add",
                    element: <AddUserScreen />,
                  },
                  {
                    path: "update/:id",
                    element: <UpdateUserScreen />,
                  },
                ]
              },
              {
                path: "students",
                element: <StudentScreen />,
              },
              {
                path: "transactions",
                element: <Transactions />,
              },
            ],
          },

          {
            path: "dashboard",
            element: <DashboardScreen />,
            children: [
              { path: "", element: <ChartScreen /> },
              {
                path: "consultants",
                element: <ConsultantScreen />,
                children: [
                  {
                    path: "add",
                    element: <AddConsultantScreen />,
                  },
                  {
                    path: "update/:id",
                    element: <UpdateConsultant />,
                  },
                ]
              },
              {
                path: "cases",
                element: <StudentScreen />,
                children: [
                  {
                    path: "add",
                    element: <AddStudentScreen />,
                  },
                ],
              },
              {
                path: "payments",
                element: <PaymentScreen />,
              },
            ],
          },
          {
            path: "/profile",
            element: <ProfileScreen />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>
);
