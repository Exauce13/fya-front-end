import { Route } from "react-router-dom";

import RoleGate from "../components/routes/RoleGate";
import FedapayReturn from "../pages/artisan/FedapayReturn";
import VerificationCenter from "../pages/artisan/VerificationCenter";

export const artisanRoutes = [
  <Route key="verification-artisan-return" path="/verification-artisan/retour-paiement" element={<FedapayReturn />} />,
  <Route
    key="verification-artisan"
    path="/verification-artisan"
    element={
      <RoleGate allow={["artisan"]}>
        <VerificationCenter />
      </RoleGate>
    }
  />,
];
