import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-[#F8F5F1] px-0 pb-10 pt-24 text-[#182433] sm:px-6 lg:px-8">
      <main className="mx-auto max-w-5xl rounded-none border-y border-[#eadfd3] bg-white p-5 shadow-sm sm:rounded-xl sm:border sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.08em] text-[#C96B2C]">
          A propos
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">FYA, Find Your Artisans</h1>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-gray-600">
          FYA facilite la rencontre entre les clients et les artisans au Bénin. La plateforme permet de découvrir des métiers, visiter des profils, publier des besoins, échanger par messagerie et suivre les services validés.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            ["Trouver", "Rechercher des artisans par métier, ville, quartier et statut de vérification."],
            ["Comparer", "Consulter profils, réalisations, avis, publications et informations publiques."],
            ["Collaborer", "Echanger, proposer des services, suivre les statuts et laisser un avis après prestation."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-lg border border-[#eadfd3] bg-[#fbfaf8] p-5">
              <h2 className="text-lg font-extrabold">{title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-gray-600">{text}</p>
            </article>
          ))}
        </div>

        <Link
          to="/explorer"
          className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-[#145DA0] px-5 text-sm font-extrabold text-white transition hover:bg-[#0f4b82]"
        >
          Explorer les artisans
        </Link>
      </main>
    </div>
  );
}
