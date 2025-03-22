import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import RestaurantsPage from "../components/restaurants/RestaurantsPage"; // ✅
import CreateRestaurantForm from "../components/restaurants/CreateRestaurantForm"; // ✅

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
        path: "restaurants", // ✅ Now handled
        element: <RestaurantsPage />,
      },
      {
        path: "restaurants/new", // ✅ Create form
        element: <CreateRestaurantForm />,
      },
    ],
  },
]);
