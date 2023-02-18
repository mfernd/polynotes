import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {LandingPage} from '@pages/LandingPage';
import "@assets/main.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage/>,
  },
]);

ReactDOM.createRoot(document.querySelector("#app") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
