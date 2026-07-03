import { useEffect } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import logo from "../../assets/images/logo.webp";
import FooterLinks from "./FooterLinks";
import SocialLinks from "./SocialLinks";

const columns = [
  { title: "Navigation", items: ["Accueil", "Explorer", "Appels d'offres", "A propos", "Contact"] },
  { title: "Ressources", items: ["CGU", "Confidentialité"] },
];

const footerRoutes = {
  Accueil: "/",
  Explorer: "/explorer",
  "Appels d'offres": "/offres",
  "A propos": "/a-propos",
  Contact: "/contact",
  CGU: "/cgu",
  Confidentialité: "/confidentialite",
};

const phoneDisplay = "01 97 71 22 74";
const phoneHref = "+2290197712274";
const email = "jeanpaulgnikpo12@gmail.com";
const googleTranslateElementId = "google_translate_element";
const googleTranslateScriptId = "google-translate-script";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61582251270989",
    icon: FacebookIcon,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/2290197712274",
    icon: WhatsAppIcon,
  },
  {
    label: "Gmail",
    href: `mailto:${email}`,
    icon: GmailIcon,
  },
  {
    label: "GitHub",
    href: "https://github.com/Exauce13",
    icon: GitHubIcon,
  },
];

export default function Footer() {
  useEffect(() => {
    if (document.getElementById(googleTranslateScriptId)) return;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate || !document.getElementById(googleTranslateElementId)) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "fr",
          includedLanguages: "fr,en",
          autoDisplay: false,
        },
        googleTranslateElementId
      );
    };

    const script = document.createElement("script");
    script.id = googleTranslateScriptId;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <footer className="mt-8 bg-[#062033] text-white">
      <div className="grid w-full gap-8 px-6 py-10 sm:px-8 md:grid-cols-[1.6fr_1fr_1fr_1.2fr] lg:px-10">
        <div>
          <img src={logo} alt="FYA" className="h-14 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/72">
            La plateforme qui facilite le savoir-faire des artisans béninois.
          </p>
          <SocialLinks links={socialLinks} />
        </div>

        <FooterLinks columns={columns} routes={footerRoutes} />

        <div>
          <h3 className="text-sm font-extrabold">Contact</h3>
          <div className="mt-4 space-y-3 text-sm text-white/72">
            <a href={`tel:${phoneHref}`} className="flex items-center gap-2 hover:text-white">
              <Phone size={15} /> {phoneDisplay}
            </a>
            <a
              href="https://wa.me/2290197712274"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-white">
              <Mail size={15} /> {email}
            </a>
            <p className="flex items-center gap-2">
              <MapPin size={15} /> Parakou, Bénin
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

function FacebookIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5.03 3.68 9.2 8.5 9.94v-7.03H7.98v-2.91h2.52V9.84c0-2.49 1.48-3.86 3.75-3.86 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.91H13.6V22c4.82-.74 8.4-4.91 8.4-9.94Z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.8 11.8 0 0 0 12.08 0C5.55 0 .23 5.32.23 11.86c0 2.09.55 4.13 1.59 5.93L.13 24l6.36-1.67a11.85 11.85 0 0 0 5.59 1.42h.01c6.54 0 11.86-5.32 11.86-11.86a11.8 11.8 0 0 0-3.43-8.41ZM12.09 21.75h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.22-3.77.99 1.01-3.68-.24-.38a9.84 9.84 0 0 1-1.51-5.23C2.19 6.42 6.63 2 12.08 2a9.84 9.84 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.43 9.86-9.87 9.86Zm5.41-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

function GmailIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm-.5 4.03-7.5 5.3-7.5-5.3V6.5l7.5 5.3 7.5-5.3v1.53Z" />
    </svg>
  );
}

function GitHubIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12.29c0 5.2 3.36 9.6 8.02 11.16.59.11.8-.26.8-.57v-2.01c-3.26.72-3.95-1.61-3.95-1.61-.53-1.38-1.3-1.75-1.3-1.75-1.07-.75.08-.74.08-.74 1.18.08 1.8 1.25 1.8 1.25 1.05 1.84 2.75 1.31 3.42 1 .11-.78.41-1.31.75-1.61-2.6-.3-5.34-1.33-5.34-5.92 0-1.31.46-2.38 1.21-3.22-.12-.3-.53-1.53.12-3.18 0 0 .99-.32 3.25 1.23.94-.27 1.95-.4 2.95-.4s2.01.13 2.95.4c2.26-1.55 3.25-1.23 3.25-1.23.65 1.65.24 2.88.12 3.18.75.84 1.21 1.91 1.21 3.22 0 4.6-2.74 5.61-5.35 5.91.42.37.8 1.1.8 2.22v3.26c0 .31.21.68.81.56a11.8 11.8 0 0 0 8.01-11.16A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}
