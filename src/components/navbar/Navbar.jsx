export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-[#1A3A5C]">
            FYA
          </h1>

          <p className="text-xs text-gray-500">
            Find Your Artisans
          </p>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#">Accueil</a>
          <a href="#">Explorer</a>
          <a href="#">Appels d'offres</a>
          <a href="#">À propos</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2 rounded-xl border border-gray-300">
            Se connecter
          </button>

          <button className="px-5 py-2 rounded-xl bg-[#C96B2C] text-white">
            S'inscrire
          </button>
        </div>

      </div>
    </header>
  );
}