import { Flag, MessageSquarePlus, Star } from "lucide-react";
import { useEffect, useState } from "react";
import UserNameLink from "../ui/UserNameLink";
import { createComplaint } from "../../services/adminService";
import { getApiMessage } from "../../services/apiClient";
import { createReview } from "../../services/reviewService";
import { useUserMode } from "../../context/useUserMode";
import profileAvatar from "../../assets/images/profile-avatar.svg";

export default function ReviewSection({
  reviews,
  rating,
  canReport = false,
  targetId,
  targetType = "user",
  targetUserId,
}) {
  const { user, isVisitor } = useUserMode();
  const [localReviews, setLocalReviews] = useState(reviews);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [report, setReport] = useState({ reason: "", description: "" });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setLocalReviews(reviews);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [reviews]);

  const submitReport = async (event) => {
    event.preventDefault();
    const reportedUserId = targetUserId || (targetType === "user" ? targetId : "");

    if (!reportedUserId) {
      alert("Impossible d'identifier l'utilisateur à signaler pour le moment.");
      return;
    }

    try {
      await createComplaint({
        reason: report.reason,
        description: report.description.trim(),
        target: targetType,
        targetId,
        reportedUserId,
      });
      setReport({ reason: "", description: "" });
      setShowReportForm(false);
      alert("Signalement envoyé.");
    } catch (error) {
      alert(getApiMessage(error, "Impossible d'envoyer le signalement."));
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();
    const reviewedUserId = targetUserId || (targetType === "user" ? targetId : "");

    if (isVisitor) {
      window.location.href = "/login";
      return;
    }

    if (!reviewedUserId) {
      alert("Impossible d'identifier l'utilisateur à évaluer pour le moment.");
      return;
    }

    if (reviewForm.comment.trim().length < 5) {
      alert("Veuillez écrire un avis un peu plus détaillé.");
      return;
    }

    try {
      const payload = await createReview(reviewedUserId, {
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });
      const savedReview = payload?.avis || payload?.data?.avis || payload?.data || payload;
      setLocalReviews((current) => [
        {
          id: savedReview?.id || `local-${Date.now()}`,
          author: savedReview?.auteur?.name || user?.name || "Utilisateur FYA",
          authorId: savedReview?.auteur?.id || user?.id || "",
          avatar: savedReview?.auteur?.photo || user?.avatar || profileAvatar,
          rating: `${Number(savedReview?.note || reviewForm.rating)}/5`,
          comment: savedReview?.commentaire || reviewForm.comment.trim(),
          date: savedReview?.created_at ? new Date(savedReview.created_at).toLocaleDateString("fr-FR") : "Aujourd'hui",
        },
        ...current.filter((item) => String(item.authorId || "") !== String(user?.id || "")),
      ]);
      setReviewForm({ rating: 5, comment: "" });
      setShowReviewForm(false);
      alert("Avis envoyé.");
    } catch (error) {
      alert(getApiMessage(error, "Impossible d'envoyer l'avis."));
    }
  };

  return (
    <section className="rounded-lg border border-[#eadfd3] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#eadfd3] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#182433]">Avis clients</h2>
          <p className="mt-1 text-sm font-semibold text-gray-500">Notes et commentaires reçus sur votre profil.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg bg-[#fff6ec] px-4 py-3 text-[#C96B2C]">
          <Star size={18} className="fill-[#C96B2C]" />
          <span className="text-xl font-extrabold">{rating}</span>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {localReviews.map((review) => (
          <article key={review.id || `${review.author}-${review.date}`} className="rounded-lg bg-[#fbfaf8] p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={review.avatar} alt={review.author} className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <h3 className="text-sm font-extrabold text-[#182433]">
                    <UserNameLink name={review.author}>{review.author}</UserNameLink>
                  </h3>
                  <p className="text-xs font-semibold text-gray-500">{review.date}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-extrabold text-[#C96B2C]">
                <Star size={15} className="fill-[#C96B2C]" />
                {review.rating}
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-gray-600">{review.comment}</p>
          </article>
        ))}
      </div>

      {canReport && (
      <div className="mt-6 border-t border-[#eadfd3] pt-5">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowReviewForm((current) => !current)}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#d7e3f1] px-4 text-sm font-extrabold text-[#145DA0] transition hover:bg-[#eef6ff]"
          >
            <MessageSquarePlus size={17} />
            Donner avis
          </button>
          <button
            type="button"
            onClick={() => setShowReportForm((current) => !current)}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-red-100 px-4 text-sm font-extrabold text-red-600 transition hover:bg-red-50"
          >
            <Flag size={17} />
            Signaler
          </button>
        </div>

        {showReviewForm && (
          <form onSubmit={submitReview} className="mt-4 max-w-xl rounded-lg border border-[#d7e3f1] bg-[#f6fbff] p-4">
            <span className="mb-2 block text-sm font-extrabold text-[#182433]">Votre note</span>
            <div className="flex gap-1 text-[#C96B2C]">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  aria-label={`Donner ${star} étoile${star > 1 ? "s" : ""}`}
                >
                  <Star size={26} className={star <= reviewForm.rating ? "fill-[#C96B2C]" : ""} />
                </button>
              ))}
            </div>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-extrabold text-[#182433]">Commentaire</span>
              <textarea
                value={reviewForm.comment}
                onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })}
                rows={4}
                className="w-full resize-none rounded-lg border border-[#eadfd3] bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-[#145DA0]"
                placeholder="Partagez votre expérience..."
                required
              />
            </label>
            <button className="mt-4 min-h-11 rounded-lg bg-[#145DA0] px-5 text-sm font-extrabold text-white transition hover:bg-[#0f4b82]">
              Envoyer l'avis
            </button>
          </form>
        )}

        {showReportForm && (
          <form onSubmit={submitReport} className="mt-4 max-w-xl rounded-lg border border-red-100 bg-red-50/30 p-4">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold text-[#182433]">Motif du signalement</span>
              <select
                value={report.reason}
                onChange={(event) => setReport({ ...report, reason: event.target.value })}
                className="h-11 w-full rounded-lg border border-[#eadfd3] bg-white px-3 text-sm font-semibold outline-none focus:border-red-500"
                required
              >
                <option value="">Sélectionnez un motif</option>
                <option value="faux-profil">Faux profil</option>
                <option value="avis-abusifs">Avis abusifs</option>
                <option value="comportement">Comportement inapproprié</option>
                <option value="autre">Autre</option>
              </select>
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-extrabold text-[#182433]">Description</span>
              <textarea
                value={report.description}
                onChange={(event) => setReport({ ...report, description: event.target.value })}
                rows={4}
                className="w-full resize-none rounded-lg border border-[#eadfd3] bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-red-500"
                placeholder="Décrivez le problème rencontré..."
                required
              />
            </label>
            <button className="mt-4 min-h-11 rounded-lg bg-red-600 px-5 text-sm font-extrabold text-white transition hover:bg-red-700">
              Envoyer le signalement
            </button>
          </form>
        )}
      </div>
      )}
    </section>
  );
}
