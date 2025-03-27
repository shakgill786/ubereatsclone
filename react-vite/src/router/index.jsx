import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import RestaurantsPage from "../components/restaurants/RestaurantsPage";
import CreateRestaurantForm from "../components/restaurants/CreateRestaurantForm";
import EditRestaurantForm from "../components/restaurants/EditRestaurantForm";
import RestaurantDetailPage from "../components/restaurants/RestaurantDetailPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
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
    ],
  },
]);
