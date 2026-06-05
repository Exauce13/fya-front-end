import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, Star } from "lucide-react";

import { useUserMode } from "../../context/useUserMode";
import { conversations, initialConversationServices } from "../../data/conversationsData";

const storageKey = "fya-conversation-services";

export default function ServiceReview() {
  const { conversationId, serviceId } = useParams();
  const navigate = useNavigate();
  const { isArtisan } = useUserMode();
  const conversation = conversations.find((item) => String(item.id) === conversationId);
  const [servicesByConversation, setServicesByConversation] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : initialConversationServices;
  });
  const [review, setReview] = useState({ rating: 5, comment: "", images: [] });
  const [error, setError] = useState("");

  const services = useMemo(
    () => servicesByConversation[conversationId] || [],
    [conversationId, servicesByConversation]
  );
  const service = services.find((item) => item.id === serviceId);
  const reviewKey = isArtisan ? "artisanReview" : "clientReview";
  const target = isArtisan ? "le client" : "l'artisan";
  const existingReview = service?.[reviewKey];

  const addImages = (files) => {
    Array.from(files || []).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setReview((current) => ({
          ...current,
          images: [...current.images, { name: file.name, src: reader.result }],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const submitReview = (event) => {
    event.preventDefault();
    if (review.comment.trim().length < 5) {
      setError("Veuillez écrire un avis un peu plus détaillé");
      return;
    }

    const nextServices = services.map((item) => {
      if (item.id !== serviceId) return item;
      return {
        ...item,
        [reviewKey]: {
          rating: review.rating,
          comment: review.comment.trim(),
          images: review.images,
          createdAt: new Date().toLocaleDateString("fr-FR"),
        },
      };
    });

    const nextServicesByConversation = {
      ...servicesByConversation,
      [conversationId]: nextServices,
    };

    setServicesByConversation(nextServicesByConversation);
    localStorage.setItem(storageKey, JSON.stringify(nextServicesByConversation));
    navigate(`/messages/${conversationId}/service`);
  };

  if (!conversation || !service) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] px-4 pt-24">
        <div className="mx-auto max-w-xl rounded-lg bg-white p-6 text-center font-bold">
          Service introuvable.
        </div>
      </div>
    );
  }

  if (service.status !== "completed") {
    return (
      <div className="min-h-screen bg-[#F8F5F1] px-4 pt-24">
        <div className="mx-auto max-w-xl rounded-lg border border-[#eadfd3] bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-extrabold">Le service n'est pas encore terminé.</p>
          <Link
            to={`/messages/${conversationId}/service`}
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
          to={`/messages/${conversationId}/service`}
          className="mb-4 inline-flex items-center gap-2 px-4 text-sm font-extrabold text-[#145DA0] sm:px-0"
        >
          <ArrowLeft size={17} />
          Retour au service
        </Link>

        <section className="rounded-none border-y border-[#eadfd3] bg-white p-5 shadow-sm sm:rounded-xl sm:border sm:p-7">
          <h1 className="text-2xl font-extrabold">Evaluer votre partenaire</h1>
          <p className="mt-2 text-sm font-semibold text-gray-500">
            Notez votre expérience avec {target} pour le service : {service.title}.
          </p>

          {existingReview ? (
            <div className="mt-6 rounded-lg bg-[#E8F7E9] p-4 text-sm font-bold text-[#267A39]">
              Votre avis a déjà été envoyé.
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
                placeholder="Partagez votre avis..."
              />
              {error && <p className="mt-1 text-xs font-bold text-red-600">{error}</p>}

              <label className="mt-4 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#d7e3f1] px-3 text-sm font-extrabold text-[#145DA0] hover:bg-[#eef6ff]">
                <ImagePlus size={17} />
                Ajouter des photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => addImages(event.target.files)}
                />
              </label>

              {review.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {review.images.map((image) => (
                    <img
                      key={image.src}
                      src={image.src}
                      alt={image.name}
                      className="aspect-square rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}

              <button className="mt-6 min-h-12 w-full rounded-lg bg-[#145DA0] text-sm font-extrabold text-white hover:bg-[#0f4b82]">
                Envoyer l'avis
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
