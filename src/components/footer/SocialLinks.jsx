export default function SocialLinks({ links }) {
  return (
    <div className="mt-5 flex gap-3 text-white/80">
      {links.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          aria-label={label}
          className="grid h-8 w-8 place-items-center rounded-full border border-white/20 text-white/85 transition hover:border-white/50 hover:bg-white/10 hover:text-white"
        >
          <Icon size={17} />
        </a>
      ))}
    </div>
  );
}
