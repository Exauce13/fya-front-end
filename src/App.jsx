import "react-phone-number-input/style.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import RealtimeProvider from "./components/realtime/RealtimeProvider.jsx";
import RoleGate from "./components/routes/RoleGate";
import ScrollManager from "./components/routes/ScrollManager.jsx";
import { UserModeProvider } from "./context/UserModeContext";
import { useUserMode } from "./context/useUserMode";
import Home from "./pages/public/Home";
import ExploreArtisans from "./pages/public/ExploreArtisans";
import ServiceCategories from "./pages/public/ServiceCategories";
import OffersEntry from "./pages/public/OffersEntry";
import ArtisanProfile from "./pages/public/ArtisanProfile";
import ClientPublicProfile from "./pages/public/ClientPublicProfile";
import PostDetails from "./pages/public/PostDetails";
import RoleProfile from "./pages/public/RoleProfile";
import Terms from "./pages/public/Terms";
import Privacy from "./pages/public/Privacy";
import NotFound from "./pages/public/NotFound";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import VerificationCenter from "./pages/artisan/VerificationCenter";
import MyServices from "./pages/artisan/MyServices";
import ClosedOffers from "./pages/client/ClosedOffers";
import MyOffers from "./pages/client/MyOffers";
import MyOfferDetails from "./pages/client/MyOfferDetails";
import CreateOffer from "./pages/client/CreateOffer";
import ClientMessages from "./pages/client/ClientMessages";
import ConversationService from "./pages/client/ConversationService";
import ServiceReview from "./pages/client/ServiceReview";
import LoginForm from "./components/auth/LoginForm";
import ArtisanRegisterForm from "./components/auth/ArtisanRegisterForm";
import ClientRegisterForm from "./components/auth/ClientRegisterForm";
import RegisterChoiceCard from "./components/auth/RegisterChoiceCards.jsx";
import ForgetPassword from "./components/auth/ForgetPassword.jsx";
import AdminRoutes from "./routes/AdminRoutes.jsx";

function AppShell() {
  const location = useLocation();
  const { user } = useUserMode();
  const authPaths = [
    "/login",
    "/artisan-register",
    "/client-register",
    "/register",
    "/forget-password",
  ];

  const isAuthPage = authPaths.includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");
  const noFooterPaths = ["/explorer", "/offres", "/messages", "/mes-services"];
  const shouldShowFooter =
    !isAuthPage &&
    !isAdminPage &&
    !noFooterPaths.some((path) => location.pathname.startsWith(path));

  if (user?.role === "admin" && !isAdminPage && !isAuthPage) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8F5F1]">
      <ScrollManager />
      <RealtimeProvider user={user} />
      {!isAuthPage && !isAdminPage && <Navbar user={user} />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/metiers" element={<ServiceCategories />} />
          <Route path="/explorer" element={<ExploreArtisans />} />
          <Route path="/offres" element={<OffersEntry />} />
          <Route path="/profile" element={<RoleProfile />} />
          <Route path="/artisans/:slug" element={<ArtisanProfile />} />
          <Route path="/clients/:slug" element={<ClientPublicProfile />} />
          <Route path="/publications/:postId" element={<PostDetails />} />
          <Route path="/cgu" element={<Terms />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/verification-artisan" element={<RoleGate allow={["artisan"]}><VerificationCenter /></RoleGate>} />
          <Route path="/mes-services" element={<RoleGate allow={["artisan", "client"]}><MyServices /></RoleGate>} />
          <Route path="/mes-services/:serviceId/avis" element={<RoleGate allow={["artisan", "client"]}><ServiceReview /></RoleGate>} />
          <Route path="/mes-appels-offres" element={<RoleGate allow={["artisan", "client"]}><MyOffers /></RoleGate>} />
          <Route path="/mes-appels-offres/fermes" element={<RoleGate allow={["artisan", "client"]}><ClosedOffers /></RoleGate>} />
          <Route path="/mes-appels-offres/:offerId" element={<RoleGate allow={["artisan", "client"]}><MyOfferDetails /></RoleGate>} />
          <Route path="/appels-offres/nouveau" element={<RoleGate allow={["artisan", "client"]}><CreateOffer /></RoleGate>} />
          <Route path="/appels-offres/:offerId/modifier" element={<RoleGate allow={["artisan", "client"]}><CreateOffer /></RoleGate>} />
          <Route path="/messages" element={<RoleGate><ClientMessages /></RoleGate>} />
          <Route path="/messages/:conversationId" element={<RoleGate><ClientMessages /></RoleGate>} />
          <Route path="/messages/:conversationId/service" element={<RoleGate><ConversationService /></RoleGate>} />
          <Route path="/messages/:conversationId/service/:serviceId/avis" element={<RoleGate><ServiceReview /></RoleGate>} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/artisan-register" element={<ArtisanRegisterForm />} />
          <Route path="/client-register" element={<ClientRegisterForm />} />
          <Route path="/register" element={<RegisterChoiceCard />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/admin/*" element={<RoleGate allow={["admin"]}><AdminRoutes /></RoleGate>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <UserModeProvider>
      <AppShell />
    </UserModeProvider>
  );
}
