import { Link } from "react-router-dom";

const items = [
  "Données de compte : nom, email, téléphone, rôle, ville, quartier et informations de profil.",
  "Données artisan : métier, années d'expérience, documents de vérification lorsque l'artisan les fournit.",
  "Données d'activité : publications, commentaires, likes, appels d'offres, candidatures, messages, services, avis et signalements.",
  "Données techniques utiles à la sécurité, au diagnostic et à la prévention des abus.",
];

export default function Privacy() {
  return (
    <div className="bg-[#F8F5F1] px-0 pb-10 pt-24 text-[#182433] sm:px-6 lg:px-8">
      <main className="mx-auto max-w-4xl rounded-none border-y border-[#eadfd3] bg-white p-5 shadow-sm sm:rounded-xl sm:border sm:p-8">
        <h1 className="text-3xl font-extrabold">Politique de confidentialité</h1>
        <p className="mt-3 text-sm font-semibold leading-7 text-gray-600">
          FYA collecte et traite les données nécessaires au fonctionnement de la plateforme, à la sécurité des comptes, à la mise en relation entre utilisateurs, à la vérification des artisans et à la modération.
        </p>

        <section className="mt-6">
          <h2 className="text-lg font-extrabold">Données concernées</h2>
          <ul className="mt-3 space-y-2 text-sm font-semibold leading-7 text-gray-600">
            {items.map((item) => (
              <li key={item} className="rounded-lg bg-[#fbfaf8] px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-extrabold">Vos droits</h2>
          <p className="mt-2 text-sm font-semibold leading-7 text-gray-600">
            Vous pouvez demander l'accès, la rectification ou la suppression de vos données lorsque cela est applicable. Certaines données peuvent être conservées temporairement pour respecter des obligations de sécurité, de preuve, de paiement ou de modération.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-extrabold">Contact</h2>
          <p className="mt-2 text-sm font-semibold leading-7 text-gray-600">
            Pour une demande liée à vos données personnelles :{" "}
            <a href="mailto:contact@fya.bj" className="font-extrabold text-[#145DA0]">
              contact@fya.bj
            </a>
            .
          </p>
        </section>

        <Link
          to="/cgu"
          className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#145DA0] px-5 text-sm font-extrabold text-white transition hover:bg-[#0f4b82]"
        >
          Voir les CGU
        </Link>
      </main>
    </div>
  );
}
