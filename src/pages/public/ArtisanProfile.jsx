import { useState } from "react";
import { MessageSquare, Rows3, Star } from "lucide-react";
import { useParams } from "react-router-dom";

import AboutSection from "../../components/artisan/AboutSection";
import ArtisanHeader from "../../components/artisan/ArtisanHeader";
import ArtisanPublications from "../../components/artisan/ArtisanPublications";
import PortfolioGallery from "../../components/artisan/PortfolioGallery";
import ReviewSection from "../../components/artisan/ReviewSection";
import { artisans, feedImages, homeAssets } from "../../components/home/homeData";
import {
  hasPasswordErrors,
  validatePasswordChange,
} from "../../utils/passwordValidation";

const defaultArtisan = {
  nom: "GNIKPO",
  prenom: "Hervé",
  metier: "Menuisier bois",
  ville: "Cotonou",
  quartier: "Fidjrossè",
  atelier: "Atelier Bois Hervé",
  startYear: 2019,
  experience: 7,
  bio: "Menuisier spécialisé dans la fabrication de meubles intérieurs et extérieurs sur mesure.",
  photo: artisans[0].image,
  verified: false,
  rating: "4.8/5",
  reviews: 128,
  services: 185,
  memberSince: "2021",
};

const verificationStatusKey = "fya-artisan-verification-status";

const filters = [
  { id: "all", label: "Tous", icon: Rows3 },
  { id: "posts", label: "Publications", icon: MessageSquare },
  { id: "reviews", label: "Avis", icon: Star },
];

const initialPortfolio = feedImages.map((src, index) => ({
  src,
  name: `Réalisation ${index + 1}`,
}));

const initialPosts = [
  {
    id: "profil-realisation-bibliotheque",
    author: "Hervé A. Menuisier",
    avatar: artisans[0].image,
    meta: "Cotonou · il y a 2 h",
    text: "Réalisation d'une bibliothèque en bois massif pour un client à Fidjrossè. Travail livré avec finition naturelle et rangements ajustés.",
    images: feedImages.map((src, index) => ({ src, name: `Projet bois ${index + 1}` })),
    likes: 128,
    comments: 34,
  },
];

const profileReviews = [
  {
    author: "Afi D.",
    avatar: "https://i.pravatar.cc/120?img=32",
    rating: "5.0",
    date: "il y a 1 semaine",
    comment: "Travail très propre, meuble livré à temps et finition au-dessus de mes attentes.",
  },
  {
    author: "Serge K.",
    avatar: "https://i.pravatar.cc/120?img=11",
    rating: "4.8",
    date: "il y a 3 semaines",
    comment: "Bonne communication et devis clair. Je recommande pour les projets de menuiserie sur mesure.",
  },
  {
    author: "Mireille T.",
    avatar: "https://i.pravatar.cc/120?img=25",
    rating: "4.7",
    date: "il y a 1 mois",
    comment: "Réparation rapide de mes placards. L'artisan a bien expliqué les choix de matériaux.",
  },
];

export default function ArtisanProfile() {
  const { slug } = useParams();
  const publicArtisan = artisans.find((item) => item.slug === slug);
  const profileSeed = publicArtisan
    ? {
        ...defaultArtisan,
        nom: publicArtisan.lastName,
        prenom: publicArtisan.firstName,
        metier: publicArtisan.job,
        ville: publicArtisan.city,
        quartier: publicArtisan.district,
        atelier: publicArtisan.workshop,
        startYear: publicArtisan.startYear,
        experience: new Date().getFullYear() - publicArtisan.startYear,
        bio: publicArtisan.bio,
        photo: publicArtisan.image,
        rating: `${publicArtisan.rating}/5`,
        reviews: Number.parseInt(publicArtisan.reviews, 10) || defaultArtisan.reviews,
        services: publicArtisan.services,
      }
    : defaultArtisan;
  const [artisan, setArtisan] = useState(profileSeed);
  const [verificationPending] = useState(() => (
    !profileSeed.verified && localStorage.getItem(verificationStatusKey) === "pending"
  ));
  const [activeFilter, setActiveFilter] = useState("all");
  const [visitorMode] = useState(Boolean(publicArtisan));
  const [aboutForm, setAboutForm] = useState({
    bio: profileSeed.bio,
    ville: profileSeed.ville,
    quartier: profileSeed.quartier,
    atelier: profileSeed.atelier,
    startYear: profileSeed.startYear,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [editingAbout, setEditingAbout] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [portfolio, setPortfolio] = useState(initialPortfolio);

  const updateProfilePhoto = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setArtisan((current) => ({ ...current, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const addPortfolioItems = (files) => {
    Array.from(files || []).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPortfolio((current) => [
          { src: reader.result, name: file.name },
          ...current,
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const saveAbout = () => {
    const passwordValidationErrors = validatePasswordChange(aboutForm);
    setPasswordErrors(passwordValidationErrors);
    if (hasPasswordErrors(passwordValidationErrors)) {
      return;
    }

    const currentYear = new Date().getFullYear();
    const startYear = Number(aboutForm.startYear) || defaultArtisan.startYear;
    const experience = Math.max(0, currentYear - startYear);

    setArtisan((current) => ({
      ...current,
      bio: aboutForm.bio.trim() || current.bio,
      ville: aboutForm.ville.trim() || current.ville,
      quartier: aboutForm.quartier.trim() || current.quartier,
      atelier: aboutForm.atelier.trim() || current.atelier,
      startYear,
      experience,
    }));
    setAboutForm((current) => ({
      ...current,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    setEditingAbout(false);
    setPasswordErrors({});
  };

  const cancelAboutEdit = () => {
    setAboutForm({
      bio: artisan.bio,
      ville: artisan.ville,
      quartier: artisan.quartier,
      atelier: artisan.atelier,
      startYear: artisan.startYear,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setEditingAbout(false);
    setPasswordErrors({});
  };

  return (
    <div className="bg-[#F8F5F1] pb-10 pt-24">
      <div className="mx-auto w-full max-w-7xl px-0 sm:px-6 lg:px-8">
        <ArtisanHeader
          artisan={artisan}
          coverImage={homeAssets.heroImage}
          visitorMode={visitorMode}
          onPhotoChange={updateProfilePhoto}
          verificationPending={verificationPending}
        />

        <nav className="mt-4 flex gap-2 overflow-x-auto rounded-lg border border-[#eadfd3] bg-white px-4 py-3 shadow-sm">
          {filters.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveFilter(id)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-sm font-extrabold transition ${
                activeFilter === id
                  ? "border-[#145DA0] text-[#145DA0]"
                  : "border-transparent text-[#182433] hover:text-[#145DA0]"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {activeFilter === "all" && (
          <>
            <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.5fr]">
              <AboutSection
                artisan={artisan}
                form={aboutForm}
                editing={editingAbout}
                visitorMode={visitorMode}
                onFormChange={setAboutForm}
                onEdit={() => setEditingAbout(true)}
                onCancel={cancelAboutEdit}
                onSave={saveAbout}
                passwordErrors={passwordErrors}
              />

              <PortfolioGallery
                items={portfolio}
                visitorMode={visitorMode}
                onAddItems={addPortfolioItems}
              />
            </div>

            <div className="mt-5">
              <ArtisanPublications
                artisan={artisan}
                initialPosts={initialPosts}
                visitorMode={visitorMode}
              />
            </div>

            <div className="mt-5">
              <ReviewSection reviews={profileReviews} rating={artisan.rating} canReport={visitorMode} />
            </div>
          </>
        )}

        {activeFilter === "posts" && (
          <div className="mt-5">
            <ArtisanPublications
              artisan={artisan}
              initialPosts={initialPosts}
              visitorMode={visitorMode}
            />
          </div>
        )}

        {activeFilter === "reviews" && (
          <div className="mt-5">
            <ReviewSection reviews={profileReviews} rating={artisan.rating} canReport={visitorMode} />
          </div>
        )}
      </div>
    </div>
  );
}
