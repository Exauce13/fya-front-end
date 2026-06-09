import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import CategoryCard from "../../components/home/CategoryCard";
import useMetiers from "../../hooks/useMetiers";

export default function ServiceCategories() {
  const { metiers, loading } = useMetiers();
  const categories = metiers.map((metier) => ({ name: metier.name }));

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-0 pb-10 pt-24 text-[#182433] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="mx-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-[#eadfd3] bg-white px-4 text-sm font-extrabold text-[#182433] transition hover:bg-[#fff3ea] sm:mx-0"
        >
          <ArrowLeft size={17} />
          Retour
        </Link>

        <section className="mt-5 rounded-none border-y border-[#eadfd3] bg-white p-5 shadow-sm sm:rounded-xl sm:border sm:p-7">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-normal">Tous les métiers</h1>
            <p className="mt-2 text-sm font-semibold text-gray-500">
              Sélectionnez un métier pour afficher les artisans correspondants.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </div>
          {!loading && categories.length === 0 && (
            <p className="mt-5 rounded-lg border border-[#eadfd3] bg-[#fbfaf8] p-5 text-sm font-bold text-gray-500">
              Aucun métier disponible pour le moment.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
