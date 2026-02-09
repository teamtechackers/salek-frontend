import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./core/store/store";
import "./index.css";
import Layout from "./ui/layouts/layout/Layout";
import Login from "./ui/pages/login/Login";
import Dashboard from "./ui/pages/dashboard/Dashboard";
import User from "./ui/pages/user/User";
import VaccineLibrary from "./ui/pages/vaccineLibrary/VaccineLibrary";
import Notifications from "./ui/pages/notifications/Notifications";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Location from "./ui/pages/location/Location";
import Hospitals from "./ui/pages/hospitals/Hospitals";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./core/components/ProtectedRoute";

const theme = createTheme();

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const adminId = localStorage.getItem('adminId');
  return !!(token && adminId);
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
              path="/"
              element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />}
            />

            {/* Protected layout routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="user" element={<User />} />
              <Route path="vaccine-library" element={<VaccineLibrary />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings/location" element={<Location />} />
              <Route path="settings/hospitals" element={<Hospitals />} />
            </Route>
          </Routes>
          <ToastContainer />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);