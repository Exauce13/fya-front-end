import { MapPin, Phone, Send } from "lucide-react";

import logo from "../../assets/images/logo.webp";

const columns = [
  { title: "Navigation", items: ["Accueil", "Explorer", "Appels d'offres", "A propos", "Contact"] },
  { title: "Ressources", items: ["Centre d'aide", "Sécurité", "CGU", "Confidentialité"] },
  { title: "Pour les artisans", items: ["S'inscrire", "Se faire vérifier", "Conseils", "Blog"] },
];

export default function Footer() {
  return (
    <footer className="mt-8 bg-[#062033] text-white">
      <div className="grid w-full gap-8 px-6 py-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <img src={logo} alt="FYA" className="h-14 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/72">
            La plateforme qui facilite le savoir-faire des artisans béninois.
          </p>
          <div className="mt-5 flex gap-3 text-white/80">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/20 text-xs font-bold">f</span>
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/20 text-xs font-bold">x</span>
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/20 text-xs font-bold">ig</span>
            <Send size={17} />
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-extrabold">{column.title}</h3>
            <div className="mt-4 space-y-2 text-sm text-white/72">
              {column.items.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-extrabold">Contact</h3>
          <div className="mt-4 space-y-3 text-sm text-white/72">
            <p className="flex items-center gap-2">
              <Phone size={15} /> +229 01 97 66 43 21
            </p>
            <p className="flex items-center gap-2">
              <Send size={15} /> contact@fya.bj
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={15} /> Cotonou, Bénin
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-xs text-white/55 sm:px-8 lg:px-10">
        © 2026 FYA - Find Your Artisans. Tous droits réservés.
      </div>
    </footer>
  );
}
