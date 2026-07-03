import { Mail, MapPin, Phone } from "lucide-react";

const phoneDisplay = "01 97 71 22 74";
const phoneHref = "+2290197712274";
const email = "jeanpaulgnikpo12@gmail.com";

export default function Contact() {
  const links = [
    {
      label: "Appeler",
      value: phoneDisplay,
      href: `tel:${phoneHref}`,
      icon: Phone,
    },
    {
      label: "WhatsApp",
      value: phoneDisplay,
      href: "https://wa.me/2290197712274",
      icon: Phone,
      external: true,
    },
    {
      label: "Gmail",
      value: email,
      href: `mailto:${email}`,
      icon: Mail,
    },
    {
      label: "GitHub",
      value: "github.com/Exauce13",
      href: "https://github.com/Exauce13",
      icon: GitHubIcon,
      external: true,
    },
  ];

  return (
    <div className="bg-[#F8F5F1] px-0 pb-10 pt-24 text-[#182433] sm:px-6 lg:px-8">
      <main className="mx-auto max-w-4xl rounded-none border-y border-[#eadfd3] bg-white p-5 shadow-sm sm:rounded-xl sm:border sm:p-8">
        <h1 className="text-3xl font-extrabold">Contact</h1>
        <p className="mt-3 text-sm font-semibold leading-7 text-gray-600">
          Besoin d'aide, d'une information ou d'un échange autour de FYA ? Utilisez l'un des canaux ci-dessous.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {links.map(({ label, value, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="flex items-center gap-4 rounded-lg border border-[#eadfd3] bg-[#fbfaf8] p-5 transition hover:border-[#145DA0] hover:bg-[#f2f8ff]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#145DA0] text-white">
                <Icon size={20} />
              </span>
              <span>
                <span className="block text-sm font-black text-[#182433]">{label}</span>
                <span className="mt-1 block text-sm font-semibold text-gray-600">{value}</span>
              </span>
            </a>
          ))}
        </div>

        <p className="mt-7 flex items-center gap-2 text-sm font-semibold text-gray-600">
          <MapPin size={17} />
          Parakou, Bénin
        </p>
      </main>
    </div>
  );
}

function GitHubIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12.29c0 5.2 3.36 9.6 8.02 11.16.59.11.8-.26.8-.57v-2.01c-3.26.72-3.95-1.61-3.95-1.61-.53-1.38-1.3-1.75-1.3-1.75-1.07-.75.08-.74.08-.74 1.18.08 1.8 1.25 1.8 1.25 1.05 1.84 2.75 1.31 3.42 1 .11-.78.41-1.31.75-1.61-2.6-.3-5.34-1.33-5.34-5.92 0-1.31.46-2.38 1.21-3.22-.12-.3-.53-1.53.12-3.18 0 0 .99-.32 3.25 1.23.94-.27 1.95-.4 2.95-.4s2.01.13 2.95.4c2.26-1.55 3.25-1.23 3.25-1.23.65 1.65.24 2.88.12 3.18.75.84 1.21 1.91 1.21 3.22 0 4.6-2.74 5.61-5.35 5.91.42.37.8 1.1.8 2.22v3.26c0 .31.21.68.81.56a11.8 11.8 0 0 0 8.01-11.16A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}
