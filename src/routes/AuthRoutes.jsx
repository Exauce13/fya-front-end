import { Routes, Route } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import ArtisanRegisterForm from "../components/auth/ArtisanRegisterForm";
import ClientRegisterForm from "../components/auth/ClientRegisterForm";
import RegisterChoiceCard from "../components/auth/RegisterChoiceCards.jsx";
import ForgetPassword from "../components/auth/ForgetPassword.jsx";


export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<LoginForm />} />

      <Route path="/artisan-register" element={<ArtisanRegisterForm />} />

      <Route path="/client-register" element={<ClientRegisterForm />} />

      <Route path="/register" element={<RegisterChoiceCard />} />

      <Route path="/forget-password" element={<ForgetPassword />} />
    </Routes>
  )
}
