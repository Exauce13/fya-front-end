import { Link } from "react-router-dom";

export default function NotFound({
  title = "Page introuvable",
  message = "La page demandée n'existe pas ou vous n'avez pas accès à cette ressource.",
}) {
  return (
    <div className="min-h-screen bg-[#F8F5F1] px-4 pb-10 pt-28 text-[#182433]">
      <section className="mx-auto max-w-xl rounded-xl border border-[#eadfd3] bg-white p-7 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.08em] text-[#C96B2C]">
          Erreur 404
        </p>
        <h1 className="mt-3 text-3xl font-extrabold">{title}</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-gray-600">
          {message}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#145DA0] px-5 text-sm font-extrabold text-white transition hover:bg-[#0f4b82]"
        >
          Retour à l'accueil
        </Link>
      </section>
    </div>
  );
}
