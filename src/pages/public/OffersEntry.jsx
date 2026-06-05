import { Navigate } from "react-router-dom";

import Offers from "./Offers";
import { useUserMode } from "../../context/useUserMode";

export default function OffersEntry() {
  const { isVisitor, isClient } = useUserMode();

  if (isVisitor) return <Navigate to="/login" replace />;
  if (isClient) return <Navigate to="/mes-appels-offres" replace />;

  return <Offers />;
}
