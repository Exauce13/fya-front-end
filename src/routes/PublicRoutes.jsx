import { Route } from "react-router-dom";

import Home from "../pages/public/Home";
import ExploreArtisans from "../pages/public/ExploreArtisans";
import ServiceCategories from "../pages/public/ServiceCategories";
import OffersEntry from "../pages/public/OffersEntry";
import ArtisanProfile from "../pages/public/ArtisanProfile";
import ClientPublicProfile from "../pages/public/ClientPublicProfile";
import PostDetails from "../pages/public/PostDetails";
import RoleProfile from "../pages/public/RoleProfile";
import Terms from "../pages/public/Terms";
import Privacy from "../pages/public/Privacy";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";

export const publicRoutes = [
  <Route key="home" path="/" element={<Home />} />,
  <Route key="metiers" path="/metiers" element={<ServiceCategories />} />,
  <Route key="explorer" path="/explorer" element={<ExploreArtisans />} />,
  <Route key="offres" path="/offres" element={<OffersEntry />} />,
  <Route key="profile" path="/profile" element={<RoleProfile />} />,
  <Route key="artisan-profile" path="/artisans/:slug" element={<ArtisanProfile />} />,
  <Route key="client-profile" path="/clients/:slug" element={<ClientPublicProfile />} />,
  <Route key="post-details" path="/publications/:postId" element={<PostDetails />} />,
  <Route key="terms" path="/cgu" element={<Terms />} />,
  <Route key="privacy" path="/confidentialite" element={<Privacy />} />,
  <Route key="about" path="/a-propos" element={<About />} />,
  <Route key="contact" path="/contact" element={<Contact />} />,
];
