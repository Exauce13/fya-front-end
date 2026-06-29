import CategoriesSection from "../../components/home/CategoriesSection";
import FeedSection from "../../components/home/FeedSection";
import HeroSection from "../../components/home/HeroSection";
import VerifiedArtisans from "../../components/home/VerifiedArtisans";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F5F1] text-[#182433]">
      <HeroSection />

      <main className="w-full px-3 py-5 sm:px-8 sm:py-6 lg:px-10">
        <CategoriesSection />
        <VerifiedArtisans />
        <FeedSection />
      </main>
    </div>
  );
}
