import SearchBar from "./SearchBar";
import { homeAssets } from "./homeData";
import heroAside from "../../assets/images/hero-aside.png";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#315766]">
      <img
        src={homeAssets.heroImage}
        alt="Artisan menuisier au travail"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#183849]/78 via-[#315766]/42 to-[#C96B2C]/10 sm:from-[#183849]/62 sm:via-[#315766]/26" />
      <img
        src={heroAside}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-20 hidden h-[calc(100%-5rem)] w-28 object-cover object-left opacity-90 md:block xl:w-34"
      />

      <div className="relative w-full px-3 pb-6 pt-24 sm:px-8 lg:px-10 lg:pt-28">
        <div className="ml-0 max-w-2xl py-8 md:ml-32 md:py-14 xl:ml-40">
          <h1 className="max-w-xl text-3xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Trouvez les meilleurs artisans du Bénin.
          </h1>
          <p className="mt-3 max-w-lg text-sm font-medium leading-6 text-white/85 sm:mt-4 sm:text-base sm:leading-7">
            Mise en relation simple, rapide et sécurisée entre clients et artisans locaux.
          </p>

          <SearchBar />
        </div>
      </div>
    </section>
  );
}
