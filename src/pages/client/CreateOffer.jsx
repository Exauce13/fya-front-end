import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import CreateOfferForm from "../../components/offers/CreateOfferForm";
import { getApiMessage } from "../../services/apiClient";
import {
  buildOfferFormData,
  createOffer,
  extractCreatedOffer,
  saveCreatedOffer,
} from "../../services/offersService";
import { useUserMode } from "../../context/useUserMode";

const isBroadcastFailureAfterCreate = (error) => {
  const message = getApiMessage(error, "");
  return /pusher|broadcast|localhost:8080|couldn'?t connect to server/i.test(message);
};

export default function CreateOffer() {
  const navigate = useNavigate();
  const { offerId } = useParams();
  const { user } = useUserMode();
  const editingOffer = null;
  const isEditing = Boolean(offerId);

  const submitOffer = async (form) => {
    const formData = buildOfferFormData(form);

    try {
      if (!isEditing) {
        const payload = await createOffer(formData);
        saveCreatedOffer(user?.id, extractCreatedOffer(payload));
      }
      navigate("/mes-appels-offres");
    } catch (error) {
      if (isBroadcastFailureAfterCreate(error)) {
        navigate("/mes-appels-offres");
        return;
      }
      alert(getApiMessage(error, "Impossible de publier cet appel d'offres."));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-6 pb-8 pt-24 text-[#182433] sm:px-8 lg:px-10">
      <section className="rounded-xl border border-[#eadfd3] bg-white px-6 py-6 shadow-sm lg:px-8">
        <Link
          to="/mes-appels-offres"
          className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#145DA0]"
        >
          <ArrowLeft size={17} />
          Mes appels d'offres
        </Link>

        <h1 className="text-3xl font-extrabold">
          {isEditing ? "Modifier l'appel d'offres" : "Publier un appel d'offres"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold text-gray-500">
          Cette page est dédiée au formulaire. La liste et la gestion des appels restent
          dans l'espace Mes appels d'offres.
        </p>

        <CreateOfferForm
          initialOffer={editingOffer}
          onCancel={() => navigate("/mes-appels-offres")}
          onSubmit={submitOffer}
        />
      </section>
    </div>
  );
}
