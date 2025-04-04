import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import RestaurantsPage from "../components/restaurants/RestaurantsPage";
import CreateRestaurantForm from "../components/restaurants/CreateRestaurantForm";
import EditRestaurantForm from "../components/restaurants/EditRestaurantForm";
import RestaurantDetailPage from "../components/restaurants/RestaurantDetailPage";
import DashboardPage from "../components/dashboard/DashboardPage";
import MenuItemsPage from "../components/MenuItem/MenuItemsPage/MenuItemsPage";


// Basic fallback error element (replace with your custom design if you want)
const ErrorElement = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>Oops! Something went wrong 😬</h1>
    <p>Please try refreshing or navigating back.</p>
  </div>
);

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorElement />, // Global error fallback
    children: [
      {
        path: "/",
        element: <RestaurantsPage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "restaurants",
        element: <RestaurantsPage />,
      },
      {
        path: "restaurants/new",
        element: <CreateRestaurantForm />,
      },
      {
        path: "restaurants/:id/edit",
        element: <EditRestaurantForm />,
      },
      {
        path: "restaurants/:id",
        element: <RestaurantDetailPage />,
      },
      {
        path: "restaurants/:id/menu",
        element: <MenuItemsPage />, // ✅ Add menu page route
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
    ],
  },
]);
