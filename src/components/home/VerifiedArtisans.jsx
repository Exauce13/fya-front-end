import { SectionHeader } from "./CategoriesSection";
import { useUserMode } from "../../context/useUserMode";

export default function VerifiedArtisans() {
  const { isVisitor } = useUserMode();

  return (
    <section className="mt-7">
      <SectionHeader
        title="Artisans vérifiés"
        actionLink={isVisitor ? "/login" : "/explorer?verified=true"}
        actionLabel="Voir tous +"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <div className="rounded-lg border border-[#eadfd3] bg-white p-6 text-sm font-bold text-gray-500 sm:col-span-2 lg:col-span-4 xl:col-span-5">
          Aucun artisan vérifié à afficher pour le moment.
        </div>
      </div>
    </section>
  );
}
