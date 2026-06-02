import "react-phone-number-input/style.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/public/Home";
import LoginForm from "./components/auth/LoginForm";
import ArtisanRegisterForm from "./components/auth/ArtisanRegisterForm";
import ClientRegisterForm from "./components/auth/ClientRegisterForm";
import RegisterChoiceCard from "./components/auth/RegisterChoiceCards.jsx";
import ForgetPassword from "./components/auth/ForgetPassword.jsx";

function App() {
  const location = useLocation();
  const authPaths = [
    "/login",
    "/artisan-register",
    "/client-register",
    "/register",
    "/forget-password",
  ];

  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#F8F5F1]">
      {!isAuthPage && <Navbar 
        name = "Jacques Ledeme"
        email="jacques@gmail.com"
        avatar= "https://i.pravatar.cc/150"
      />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/artisan-register" element={<ArtisanRegisterForm />} />
          <Route path="/client-register" element={<ClientRegisterForm />} />
          <Route path="/register" element={<RegisterChoiceCard />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App
