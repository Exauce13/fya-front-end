import { Flag, Star } from "lucide-react";
import { useState } from "react";
import UserNameLink from "../ui/UserNameLink";

export default function ReviewSection({ reviews, rating, canReport = false }) {
  const [showReportForm, setShowReportForm] = useState(false);
  const [report, setReport] = useState({ reason: "", description: "" });

  const submitReport = (event) => {
    event.preventDefault();
    setReport({ reason: "", description: "" });
    setShowReportForm(false);
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
        {reviews.map((review) => (
          <article key={`${review.author}-${review.date}`} className="rounded-lg bg-[#fbfaf8] p-4">
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
        <button
          type="button"
          onClick={() => setShowReportForm((current) => !current)}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-red-100 px-4 text-sm font-extrabold text-red-600 transition hover:bg-red-50"
        >
          <Flag size={17} />
          Signaler
        </button>

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
