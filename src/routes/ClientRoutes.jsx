import { Route } from "react-router-dom";

import RoleGate from "../components/routes/RoleGate";
import MyServices from "../pages/artisan/MyServices";
import ClosedOffers from "../pages/client/ClosedOffers";
import MyOffers from "../pages/client/MyOffers";
import MyOfferDetails from "../pages/client/MyOfferDetails";
import CreateOffer from "../pages/client/CreateOffer";
import ClientMessages from "../pages/client/ClientMessages";
import ConversationService from "../pages/client/ConversationService";
import ServiceReview from "../pages/client/ServiceReview";

const clientAndArtisanRoles = ["artisan", "client"];

export const clientRoutes = [
  <Route
    key="my-services"
    path="/mes-services"
    element={
      <RoleGate allow={clientAndArtisanRoles}>
        <MyServices />
      </RoleGate>
    }
  />,
  <Route
    key="my-service-review"
    path="/mes-services/:serviceId/avis"
    element={
      <RoleGate allow={clientAndArtisanRoles}>
        <ServiceReview />
      </RoleGate>
    }
  />,
  <Route
    key="my-offers"
    path="/mes-appels-offres"
    element={
      <RoleGate allow={clientAndArtisanRoles}>
        <MyOffers />
      </RoleGate>
    }
  />,
  <Route
    key="closed-offers"
    path="/mes-appels-offres/fermes"
    element={
      <RoleGate allow={clientAndArtisanRoles}>
        <ClosedOffers />
      </RoleGate>
    }
  />,
  <Route
    key="my-offer-details"
    path="/mes-appels-offres/:offerId"
    element={
      <RoleGate allow={clientAndArtisanRoles}>
        <MyOfferDetails />
      </RoleGate>
    }
  />,
  <Route
    key="create-offer"
    path="/appels-offres/nouveau"
    element={
      <RoleGate allow={clientAndArtisanRoles}>
        <CreateOffer />
      </RoleGate>
    }
  />,
  <Route
    key="edit-offer"
    path="/appels-offres/:offerId/modifier"
    element={
      <RoleGate allow={clientAndArtisanRoles}>
        <CreateOffer />
      </RoleGate>
    }
  />,
  <Route
    key="messages"
    path="/messages"
    element={
      <RoleGate>
        <ClientMessages />
      </RoleGate>
    }
  />,
  <Route
    key="conversation"
    path="/messages/:conversationId"
    element={
      <RoleGate>
        <ClientMessages />
      </RoleGate>
    }
  />,
  <Route
    key="conversation-service"
    path="/messages/:conversationId/service"
    element={
      <RoleGate>
        <ConversationService />
      </RoleGate>
    }
  />,
  <Route
    key="conversation-service-review"
    path="/messages/:conversationId/service/:serviceId/avis"
    element={
      <RoleGate>
        <ServiceReview />
      </RoleGate>
    }
  />,
];
