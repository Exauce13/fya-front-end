import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";

import { useUserMode } from "../../context/useUserMode";
import { getApiMessage } from "../../services/apiClient";
import { createReview } from "../../services/reviewService";
import { getService } from "../../services/serviceService";

const getServiceFromPayload = (payload) => payload?.service || payload?.data?.service || payload?.data || payload;
const getUserClientId = (user) => user?.client?.id || user?.clients?.id || user?.client_id || user?.clientId;
const getUserArtisanId = (user) => user?.artisan?.id || user?.artisan_id || user?.artisanId;

const normalizeService = (service) => {
  if (!service?.id) return null;
  const clientUser = service.client?.user || {};
  const artisanUser = service.artisan?.user || {};

  return {
    ...service,
    title: service.titre || service.title || "Service",
    status: service.statut || service.status || "en_attente",
    clientId: service.client_id || service.client?.id,
    clientUserId: clientUser.id || service.client?.user_id,
    clientName: clientUser.name || "le client",
    artisanId: service.artisan_id || service.artisan?.id,
    artisanUserId: artisanUser.id || service.artisan?.user_id,
    artisanName: artisanUser.name || "l'artisan",
    artisanCompleted: Boolean(service.artisan_termine_at),
    clientCompleted: Boolean(service.client_termine_at),
  };
};

export default function ServiceReview() {
  const { conversationId, serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserMode();
  const returnPath = conversationId ? `/messages/${conversationId}/service` : "/mes-services";
  const [service, setService] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadService() {
      setLoading(true);
      setError("");
      try {
        const payload = await getService(serviceId);
        if (active) setService(normalizeService(getServiceFromPayload(payload)));
      } catch (loadError) {
        if (active) setError(getApiMessage(loadError, "Impossible de charger ce service."));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadService();

    return () => {
      active = false;
    };
  }, [serviceId]);

  const reviewContext = useMemo(() => {
    if (!service) return { targetUserId: null, targetName: "votre partenaire", canReview: false };

    const currentClientId = getUserClientId(user);
    const currentArtisanId = getUserArtisanId(user);
    const isCreator =
      Number(service.artisanUserId) === Number(user?.id) ||
      (currentArtisanId && Number(service.artisanId) === Number(currentArtisanId));
    const isClient =
      Number(service.clientUserId) === Number(user?.id) ||
      (currentClientId && Number(service.clientId) === Number(currentClientId));
    const canReview =
      service.status === "terminer" ||
      (isCreator && service.artisanCompleted) ||
      (isClient && service.clientCompleted);

    if (isCreator) {
      return {
        targetUserId: service.clientUserId,
        targetName: service.clientName,
        label: "le client",
        canReview,
      };
    }

    return {
      targetUserId: service.artisanUserId,
      targetName: service.artisanName,
      label: "l'artisan",
      canReview,
    };
  }, [service, user]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!reviewContext.targetUserId) {
      setError("Impossible d'identifier la personne à évaluer.");
      return;
    }
    if (review.comment.trim().length < 5) {
      setError("Veuillez écrire un avis un peu plus détaillé.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await createReview(reviewContext.targetUserId, {
        rating: review.rating,
        comment: review.comment.trim(),
      });
      setSuccess(true);
      setTimeout(() => navigate(returnPath), 700);
    } catch (submitError) {
      setError(getApiMessage(submitError, "Impossible d'envoyer l'avis."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] px-4 pt-24">
        <div className="mx-auto max-w-xl rounded-lg bg-white p-6 text-center font-bold">
          Chargement du service...
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] px-4 pt-24">
        <div className="mx-auto max-w-xl rounded-lg bg-white p-6 text-center font-bold">
          {error || "Service introuvable."}
        </div>
      </div>
    );
  }

  if (!reviewContext.canReview) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] px-4 pt-24">
        <div className="mx-auto max-w-xl rounded-lg border border-[#eadfd3] bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-extrabold">Le service doit d'abord être marqué comme terminé.</p>
          <Link
            to={returnPath}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#145DA0] px-5 text-sm font-extrabold text-white"
          >
            Retour au service
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-0 pb-10 pt-24 text-[#182433] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          to={returnPath}
          className="mb-4 inline-flex items-center gap-2 px-4 text-sm font-extrabold text-[#145DA0] sm:px-0"
        >
          <ArrowLeft size={17} />
          Retour au service
        </Link>

        <section className="rounded-none border-y border-[#eadfd3] bg-white p-5 shadow-sm sm:rounded-xl sm:border sm:p-7">
          <h1 className="text-2xl font-extrabold">Evaluer votre partenaire</h1>
          <p className="mt-2 text-sm font-semibold text-gray-500">
            Notez votre expérience avec {reviewContext.targetName} pour le service : {service.title}.
          </p>

          {success ? (
            <div className="mt-6 rounded-lg bg-[#E8F7E9] p-4 text-sm font-bold text-[#267A39]">
              Avis envoyé avec succès.
            </div>
          ) : (
            <form onSubmit={submitReview} className="mt-6">
              <div className="flex gap-1 text-[#F5A623]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReview({ ...review, rating: star })}
                    aria-label={`Donner ${star} étoile${star > 1 ? "s" : ""}`}
                  >
                    <Star size={32} className={star <= review.rating ? "fill-[#F5A623]" : ""} />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm font-extrabold text-[#145DA0]">
                {review.rating >= 4 ? "Très satisfait" : "Votre ressenti compte"}
              </p>

              <textarea
                value={review.comment}
                onChange={(event) => setReview({ ...review, comment: event.target.value })}
                rows={5}
                className="mt-5 w-full resize-none rounded-lg border border-[#eadfd3] px-4 py-3 text-sm font-semibold outline-none focus:border-[#145DA0]"
                placeholder={`Partagez votre avis sur ${reviewContext.label}...`}
              />
              {error && <p className="mt-2 text-xs font-bold text-red-600">{error}</p>}

              <button disabled={submitting} className="mt-6 min-h-12 w-full rounded-lg bg-[#145DA0] text-sm font-extrabold text-white hover:bg-[#0f4b82] disabled:opacity-60">
                {submitting ? "Envoi..." : "Envoyer l'avis"}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
