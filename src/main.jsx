import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Layout from "./ui/layouts/Layout";
import Login from "./ui/pages/Login";
import Dashboard from "./ui/pages/dashboard";
import User from "./ui/pages/user";
import VaccineLibrary from "./ui/pages/VaccineLibrary";
import Notifications from "./ui/pages/notifications";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Protected layout routes */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user" element={<User />} />
          <Route path="vaccine-library" element={<VaccineLibrary />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
