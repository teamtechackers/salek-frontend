import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./core/store/store";
import "./index.css";
import Layout from "./ui/layouts/layout/Layout";
import Login from "./ui/pages/login/Login";
import Dashboard from "./ui/pages/dashboard/Dashboard";
import User from "./ui/pages/user/User";
import VaccineLibrary from "./ui/pages/vaccineLibrary/VaccineLibrary";
import Notifications from "./ui/pages/notifications/Notifications"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          {/* Protected layout routes */}
          <Route path="/app" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="user" element={<User />} />
            <Route path="vaccine-library" element={<VaccineLibrary />} />
            <Route path="notifications" element={<Notifications/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
