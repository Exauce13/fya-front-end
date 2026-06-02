import PostCard from "./PostCard";
import { artisans } from "./homeData";

export default function FeedSection() {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-extrabold text-[#182433]">Fil d'actualité</h2>
      <div className="mt-4 rounded-lg border border-[#eadfd3] bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={artisans[1].image}
            alt="Grace C."
            className="h-11 w-11 rounded-full object-cover"
          />
          <div className="flex min-h-11 flex-1 items-center rounded-full bg-[#f6f2ed] px-5 text-sm text-gray-500">
            Quoi de neuf aujourd'hui ?
          </div>
          <button className="rounded-md bg-[#2563EB] px-5 py-2 text-sm font-bold text-white">
            Publier
          </button>
        </div>
      </div>
      <PostCard />
    </section>
  );
}
