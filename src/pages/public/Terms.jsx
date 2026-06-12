import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Objet de la plateforme",
    content:
      "FYA met en relation des clients, visiteurs et artisans afin de faciliter la recherche d'artisans, la publication de contenus, les appels d'offres, la messagerie, les services et les avis. La plateforme n'est pas partie au contrat de prestation conclu entre un client et un artisan.",
  },
  {
    title: "2. Comptes et catégories d'utilisateurs",
    content:
      "La plateforme distingue notamment les visiteurs, clients, artisans et administrateurs. Chaque utilisateur s'engage à fournir des informations exactes, à maintenir la confidentialité de ses identifiants et à ne pas usurper l'identité d'un tiers.",
  },
  {
    title: "3. Inscription et vérification",
    content:
      "L'inscription nécessite des informations d'identification telles que le nom, l'email, le téléphone, la ville ou le métier selon le type de compte. L'email et le numéro de téléphone doivent être uniques. Les artisans peuvent demander une vérification avec des documents justificatifs. FYA peut refuser, suspendre ou retirer une vérification en cas d'information inexacte, document non conforme ou comportement contraire aux présentes conditions.",
  },
  {
    title: "4. Publications, réalisations et contenus",
    content:
      "L'utilisateur reste responsable des textes, images, vidéos, documents, commentaires et réalisations qu'il publie. Il garantit disposer des droits nécessaires et s'interdit tout contenu illicite, trompeur, diffamatoire, discriminatoire, violent, obscène, frauduleux ou portant atteinte aux droits d'autrui.",
  },
  {
    title: "5. Appels d'offres, candidatures et services",
    content:
      "Les clients peuvent lancer des appels d'offres et les artisans peuvent y répondre lorsque les fonctionnalités le permettent. Les informations communiquées dans une candidature ou un service doivent être sincères. Les prix, délais, devis, acceptations, annulations et validations relèvent de l'accord entre les utilisateurs concernés.",
  },
  {
    title: "6. Messagerie et échanges",
    content:
      "La messagerie sert aux échanges liés à la recherche, à la préparation et au suivi d'un service. Les utilisateurs doivent y conserver un comportement respectueux. FYA peut limiter l'accès à la messagerie ou traiter un signalement lorsqu'un échange présente un risque pour les utilisateurs ou la plateforme.",
  },
  {
    title: "7. Avis, notes et signalements",
    content:
      "Les avis doivent refléter une expérience réelle et rester respectueux. Les signalements permettent d'alerter l'administration sur un faux profil, une fraude, une conduite abusive ou un contenu problématique. Les signalements abusifs peuvent entraîner des restrictions.",
  },
  {
    title: "8. Paiements et frais",
    content:
      "Certaines opérations, comme la vérification ou le renouvellement, peuvent être soumises à paiement. Les frais affichés avant validation s'appliquent. Les paiements peuvent être traités par un prestataire tiers tel que FedaPay, selon ses propres conditions et règles de sécurité.",
  },
  {
    title: "9. Données personnelles",
    content:
      "FYA collecte uniquement les données nécessaires au fonctionnement de la plateforme : création de compte, recherche d'artisans, messagerie, vérification, sécurité, modération, paiement et amélioration du service. Les utilisateurs peuvent demander l'accès, la rectification ou la suppression de leurs données selon les règles applicables. Le traitement doit respecter les principes de loyauté, transparence, finalité, proportionnalité, sécurité et durée de conservation adaptée.",
  },
  {
    title: "10. Sécurité et suspension",
    content:
      "FYA peut suspendre ou restreindre un compte en cas d'usage frauduleux, tentative d'accès non autorisé, contenu illicite, plainte sérieuse, non-respect des présentes conditions ou risque pour la sécurité des utilisateurs.",
  },
  {
    title: "11. Responsabilité",
    content:
      "FYA fait ses meilleurs efforts pour assurer l'accès à la plateforme, mais ne garantit pas l'absence permanente d'interruption, d'erreur technique ou d'indisponibilité. Les utilisateurs restent responsables de leurs engagements, prestations, informations, documents et échanges.",
  },
  {
    title: "12. Modification des conditions",
    content:
      "FYA peut faire évoluer les présentes conditions pour tenir compte de nouvelles fonctionnalités, d'exigences légales ou de besoins de sécurité. La version applicable est celle publiée sur cette page au moment de l'utilisation.",
  },
];

export default function Terms() {
  return (
    <div className="bg-[#F8F5F1] px-0 pb-10 pt-24 text-[#182433] sm:px-6 lg:px-8">
      <main className="mx-auto max-w-5xl rounded-none border-y border-[#eadfd3] bg-white p-5 shadow-sm sm:rounded-xl sm:border sm:p-8">
        <div className="border-b border-[#eadfd3] pb-6">
          <p className="text-sm font-black uppercase tracking-[0.08em] text-[#C96B2C]">
            FYA
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">
            Conditions Générales d'Utilisation
          </h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-gray-600">
            Ces conditions définissent les règles d'utilisation de FYA, plateforme de mise en relation entre clients et artisans au Bénin.
          </p>
          <p className="mt-3 rounded-lg border border-[#f0d7c3] bg-[#fff7ef] p-3 text-sm font-bold text-[#8a4a1b]">
            Ce document est une base fonctionnelle pour le projet. Il doit être relu par un professionnel du droit avant une mise en production officielle.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-extrabold">{section.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-7 text-gray-600">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-lg border border-[#d8e3ef] bg-[#f6fbff] p-5">
          <h2 className="text-lg font-extrabold">Contact</h2>
          <p className="mt-2 text-sm font-semibold leading-7 text-gray-600">
            Pour toute question relative aux conditions d'utilisation, à un compte ou aux données personnelles, contactez FYA à{" "}
            <a href="mailto:contact@fya.bj" className="font-extrabold text-[#145DA0]">
              contact@fya.bj
            </a>
            .
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[#145DA0] px-5 text-sm font-extrabold text-white transition hover:bg-[#0f4b82]"
          >
            Retour à l'accueil
          </Link>
        </section>
      </main>
    </div>
  );
}
