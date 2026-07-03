import { Route } from "react-router-dom";

import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import RegisterArtisan from "../pages/auth/RegisterArtisan";
import RegisterChoice from "../pages/auth/RegisterChoice";
import RegisterClient from "../pages/auth/RegisterClient";
import ResetPassword from "../pages/auth/ResetPassword";

export const authPaths = [
  "/login",
  "/artisan-register",
  "/client-register",
  "/register",
  "/forget-password",
  "/reset-password",
];

export const authRoutes = [
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="artisan-register" path="/artisan-register" element={<RegisterArtisan />} />,
  <Route key="client-register" path="/client-register" element={<RegisterClient />} />,
  <Route key="register" path="/register" element={<RegisterChoice />} />,
  <Route key="forget-password" path="/forget-password" element={<ForgotPassword />} />,
  <Route key="reset-password" path="/reset-password" element={<ResetPassword />} />,
];
