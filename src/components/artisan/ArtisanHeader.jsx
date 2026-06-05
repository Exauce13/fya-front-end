import { Camera, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";

import VerificationBadge from "./VerificationBadge";

export default function ArtisanHeader({
  artisan,
  coverImage,
  visitorMode,
  onPhotoChange,
  verificationPending,
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#eadfd3] bg-white shadow-sm">
      <div
        className="relative h-52 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(16, 36, 55, .78), rgba(16, 36, 55, .24)), url(${coverImage})`,
        }}
      />

      <div className="relative px-6 pb-6 md:px-9">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <div className="-mt-20 shrink-0">
              <div className="relative h-36 w-36 rounded-full border-4 border-white bg-white shadow-lg">
                <img
                  src={artisan.photo}
                  alt={`${artisan.prenom} ${artisan.nom}`}
                  className="h-full w-full rounded-full object-cover"
                />
                {!visitorMode && (
                  <label className="absolute bottom-2 right-1 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-[#145DA0] text-white shadow-md transition hover:bg-[#0f4b82]">
                    <Camera size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => onPhotoChange(event.target.files?.[0])}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="pt-4 md:pt-5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-extrabold tracking-normal text-[#182433]">
                  {artisan.prenom} {artisan.nom}
                </h1>
                <VerificationBadge verified={artisan.verified} />
              </div>
              <p className="mt-2 text-base font-extrabold text-[#182433]">
                {artisan.metier} à {artisan.ville}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold text-gray-600">
                <span className="inline-flex items-center gap-1 text-[#C96B2C]">
                  <Star size={16} className="fill-[#C96B2C]" />
                  {artisan.rating} ({artisan.reviews} avis)
                </span>
                <span>{artisan.services} prestations</span>
                <span>Membre depuis {artisan.memberSince}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 md:justify-end md:pt-5">
            {!visitorMode && !artisan.verified && verificationPending && (
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#f0d2b8] bg-[#fff3ea] px-4 text-sm font-extrabold text-[#C96B2C]"
              >
                <ShieldCheck size={17} />
                Vérification en cours
              </button>
            )}
            {!visitorMode && !artisan.verified && !verificationPending && (
              <Link
                to="/verification-artisan"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#C96B2C] px-4 text-sm font-extrabold text-white transition hover:bg-[#b65e23]"
              >
                <ShieldCheck size={17} />
                Se faire vérifier
              </Link>
            )}
            {visitorMode && (
              <button className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#145DA0] px-4 text-sm font-extrabold text-white transition hover:bg-[#0f4b82]">
                <MessageCircle size={17} />
                Contacter
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
