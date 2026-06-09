import { useEffect, useState } from "react";
import { MessageSquare, Rows3, Star } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";

import AboutSection from "../../components/artisan/AboutSection";
import ArtisanHeader from "../../components/artisan/ArtisanHeader";
import ArtisanPublications from "../../components/artisan/ArtisanPublications";
import PortfolioGallery from "../../components/artisan/PortfolioGallery";
import ReviewSection from "../../components/artisan/ReviewSection";
import { artisans, homeAssets } from "../../components/home/homeData";
import { useUserMode } from "../../context/useUserMode";
import { getApiMessage, getStorageUrl } from "../../services/apiClient";
import { getArtisanAvis, getArtisanPosts } from "../../services/artisanService";
import { updatePassword } from "../../services/authService";
import { createPost } from "../../services/postsService";
import { updateProfileInformation, updateProfilePhoto as uploadProfilePhoto } from "../../services/profileService";
import profileAvatar from "../../assets/images/profile-avatar.svg";
import {
  hasPasswordErrors,
  validatePasswordChange,
} from "../../utils/passwordValidation";

const defaultArtisan = {
  id: "",
  nom: "",
  prenom: "Artisan FYA",
  metier: "",
  ville: "",
  quartier: "",
  atelier: "",
  experience: 0,
  bio: "",
  photo: profileAvatar,
  verified: false,
  rating: "0/5",
  reviews: 0,
  services: 0,
  memberSince: "",
};

const verificationStatusKey = "fya-artisan-verification-status";

const filters = [
  { id: "all", label: "Tous", icon: Rows3 },
  { id: "posts", label: "Publications", icon: MessageSquare },
  { id: "reviews", label: "Avis", icon: Star },
];

const initialPortfolio = [];

const initialPosts = [];

const profileReviews = [];

const allowedRealizationExtensions = /\.(jpe?g|png|webp)$/i;

const getPostItems = (payload) => {
  if (Array.isArray(payload?.posts?.data)) return payload.posts.data;
  if (Array.isArray(payload?.data?.posts?.data)) return payload.data.posts.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const isRealizationPost = (post) => /r[eé]alisation/i.test(String(post.post_type || post.type || ""));

const normalizeRealizationImages = (posts) =>
  posts
    .filter(isRealizationPost)
    .flatMap((post) => post.media_json || post.media_urls || post.media || [])
    .map((path) => {
      const value = String(path).replace(/^\/?storage\/?/, "");
      return {
        src: getStorageUrl(path),
        name: value.split("/").pop() || "realisation",
      };
    });

const normalizeVisitedArtisan = (artisan = {}, fallbackId = "") => {
  const raw = artisan.raw || artisan;
  const user = raw.user || artisan.user || {};
  const experience = raw.annees_experiences ?? artisan.annees_experiences ?? artisan.experience ?? 0;

  return {
    id: raw.id || artisan.id || fallbackId,
    name: artisan.name || user.name || raw.name || "",
    metier: raw.metier?.nom || artisan.job || artisan.category || raw.metier_nom || "",
    ville: artisan.city || raw.ville || user.ville || "",
    quartier: artisan.district || raw.quartier || user.quartier || "",
    atelier: artisan.workshop || raw.nom_atelier || raw.nom_association || "",
    experience: Number.parseInt(experience, 10) || 0,
    bio: artisan.bio || raw.bio || "",
    photo: getStorageUrl(artisan.image || raw.photo || user.photo) || profileAvatar,
    verified: Boolean(artisan.verified || raw.is_certifed || raw.is_certified),
    rating: `${artisan.rating || raw.rating || 0}/5`,
    reviews: Number(artisan.reviews || raw.reviews || 0),
    email: artisan.email || user.email || raw.email || "",
    telephone: artisan.telephone || user.telephone || raw.telephone || "",
    statut: artisan.statut || user.statut || raw.statut || "",
  };
};

const normalizeBackendArtisan = (backendArtisan = {}) => {
  const user = backendArtisan.user || {};

  return {
    id: backendArtisan.id,
    prenom: user.name || "Artisan FYA",
    metier: backendArtisan.metier?.nom || "",
    ville: user.ville || backendArtisan.ville || "",
    quartier: user.quartier || backendArtisan.quartier || "",
    atelier: backendArtisan.nom_atelier || backendArtisan.nom_association || "",
    experience: Number(backendArtisan.annees_experiences || 0),
    bio: backendArtisan.bio || "",
    photo: getStorageUrl(user.photo) || profileAvatar,
    verified: Boolean(backendArtisan.is_certifed || backendArtisan.is_certified),
    email: user.email || "",
    telephone: user.telephone || "",
    statut: user.statut || "",
  };
};

export default function ArtisanProfile() {
  const { slug } = useParams();
  const location = useLocation();
  const { user } = useUserMode();
  const routedArtisan = location.state?.artisan;
  const publicArtisan = artisans.find((item) => item.slug === slug);
  const artisanData = user?.artisan || user?.artisan_p || {};
  const metier = artisanData.metier?.nom || user?.metier?.nom || user?.metier_nom || user?.trade || "";
  const fullName = user?.name || "";
  const memberSince = user?.created_at ? new Date(user.created_at).getFullYear().toString() : "";
  const ownProfileSeed = {
    ...defaultArtisan,
    id: artisanData.id || user?.artisan_id || user?.artisan_p?.id || "",
    nom: "",
    prenom: fullName || defaultArtisan.prenom,
    metier,
    ville: user?.ville || "",
    quartier: user?.quartier || "",
    atelier: artisanData.nom_atelier || artisanData.nom_association || "",
    experience: Number(artisanData.annees_experiences || 0),
    bio: artisanData.bio || user?.bio || "",
    photo: getStorageUrl(user?.photo) || user?.avatar || profileAvatar,
    verified: Boolean(artisanData.is_certifed || artisanData.is_certified || user?.is_certifed),
    rating: user?.rating || "0/5",
    reviews: user?.reviews_count || user?.avis_count || 0,
    services: user?.prestations_count || user?.services_count || 0,
    memberSince,
    email: user?.email || "",
    telephone: user?.telephone || "",
    statut: user?.statut || "",
  };
  const profileSeed = routedArtisan
    ? {
        ...defaultArtisan,
        id: normalizeVisitedArtisan(routedArtisan, slug).id,
        nom: "",
        prenom: normalizeVisitedArtisan(routedArtisan, slug).name || defaultArtisan.prenom,
        metier: normalizeVisitedArtisan(routedArtisan, slug).metier,
        ville: normalizeVisitedArtisan(routedArtisan, slug).ville,
        quartier: normalizeVisitedArtisan(routedArtisan, slug).quartier,
        atelier: normalizeVisitedArtisan(routedArtisan, slug).atelier,
        experience: normalizeVisitedArtisan(routedArtisan, slug).experience,
        bio: normalizeVisitedArtisan(routedArtisan, slug).bio,
        photo: normalizeVisitedArtisan(routedArtisan, slug).photo,
        verified: normalizeVisitedArtisan(routedArtisan, slug).verified,
        rating: normalizeVisitedArtisan(routedArtisan, slug).rating,
        reviews: normalizeVisitedArtisan(routedArtisan, slug).reviews,
        email: normalizeVisitedArtisan(routedArtisan, slug).email,
        telephone: normalizeVisitedArtisan(routedArtisan, slug).telephone,
        statut: normalizeVisitedArtisan(routedArtisan, slug).statut,
      }
    : publicArtisan
    ? {
        ...defaultArtisan,
        id: publicArtisan.id || slug,
        nom: publicArtisan.lastName,
        prenom: publicArtisan.firstName,
        metier: publicArtisan.job,
        ville: publicArtisan.city,
        quartier: publicArtisan.district,
        atelier: publicArtisan.workshop,
        experience: new Date().getFullYear() - publicArtisan.startYear,
        bio: publicArtisan.bio,
        photo: publicArtisan.image,
        rating: `${publicArtisan.rating}/5`,
        reviews: Number.parseInt(publicArtisan.reviews, 10) || defaultArtisan.reviews,
        services: publicArtisan.services,
      }
    : ownProfileSeed;
  const [artisan, setArtisan] = useState(profileSeed);
  const [verificationPending] = useState(() => (
    !profileSeed.verified && localStorage.getItem(verificationStatusKey) === "pending"
  ));
  const [activeFilter, setActiveFilter] = useState("all");
  const [visitorMode] = useState(Boolean(publicArtisan || routedArtisan));
  const [aboutForm, setAboutForm] = useState({
    bio: profileSeed.bio,
    ville: profileSeed.ville,
    quartier: profileSeed.quartier,
    atelier: profileSeed.atelier,
    experience: profileSeed.experience,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [editingAbout, setEditingAbout] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioUploading, setPortfolioUploading] = useState(false);

  useEffect(() => {
    if (!artisan.id) return;

    let active = true;

    async function loadPortfolio() {
      setPortfolioLoading(true);
      try {
        const [postsResponse, avisResponse] = await Promise.allSettled([
          getArtisanPosts(artisan.id),
          getArtisanAvis(artisan.id),
        ]);

        if (active) {
          const postsPayload = postsResponse.status === "fulfilled" ? postsResponse.value : null;
          const avisPayload = avisResponse.status === "fulfilled" ? avisResponse.value : null;
          const backendArtisan =
            postsPayload?.artisan ||
            postsPayload?.data?.artisan ||
            avisPayload?.artisan ||
            avisPayload?.data?.artisan;

          if (backendArtisan) {
            const nextArtisan = normalizeBackendArtisan(backendArtisan);
            setArtisan((current) => ({
              ...current,
              ...Object.fromEntries(
                Object.entries(nextArtisan).filter(([, value]) => value !== "" && value !== null && value !== undefined)
              ),
            }));
          }
          setPortfolio(normalizeRealizationImages(getPostItems(postsPayload)));
        }
      } catch {
        if (active) setPortfolio([]);
      } finally {
        if (active) setPortfolioLoading(false);
      }
    }

    loadPortfolio();

    return () => {
      active = false;
    };
  }, [artisan.id]);

  const updateProfilePhoto = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    const reader = new FileReader();
    reader.onload = () => {
      setArtisan((current) => ({ ...current, photo: reader.result }));
    };
    reader.readAsDataURL(file);

    try {
      const payload = await uploadProfilePhoto(formData);
      const photo = getStorageUrl(payload?.photo_url || payload?.photo || payload?.user?.photo);
      if (photo) setArtisan((current) => ({ ...current, photo }));
    } catch (error) {
      alert(getApiMessage(error, "Impossible de modifier la photo de profil."));
    }
  };

  const addPortfolioItems = async (files) => {
    const selectedFiles = Array.from(files || []);
    const invalidFile = selectedFiles.find((file) => !allowedRealizationExtensions.test(file.name));

    if (invalidFile) {
      alert("Format invalide. Les réalisations acceptent uniquement jpg, jpeg, png ou webp.");
      return;
    }

    if (selectedFiles.length === 0) return;

    setPortfolioUploading(true);
    try {
      const payload = await createPost({
        description: "",
        postType: "realisations",
        media: selectedFiles,
      });
      const nextItems = normalizeRealizationImages([
        {
          ...(payload?.post || {}),
          media_json: payload?.post?.media_json || payload?.media_urls || [],
          post_type: payload?.post?.post_type || "realisations",
        },
      ]);

      setPortfolio((current) => [...nextItems, ...current]);
    } catch (error) {
      alert(getApiMessage(error, "Impossible d'ajouter les réalisations."));
    } finally {
      setPortfolioUploading(false);
    }
  };

  const saveAbout = async () => {
    const passwordValidationErrors = validatePasswordChange(aboutForm);
    setPasswordErrors(passwordValidationErrors);
    if (hasPasswordErrors(passwordValidationErrors)) {
      return;
    }

    const experience = Math.max(0, Number(aboutForm.experience) || 0);

    try {
      if (user?.id) {
        await updateProfileInformation(user.id, {
          ville: aboutForm.ville.trim(),
          quartier: aboutForm.quartier.trim(),
          bio: aboutForm.bio.trim(),
          nom_atelier: aboutForm.atelier.trim(),
          annees_experiences: experience,
        });
      }

      if (aboutForm.currentPassword || aboutForm.newPassword || aboutForm.confirmPassword) {
        await updatePassword(aboutForm);
      }

      setArtisan((current) => ({
        ...current,
        bio: aboutForm.bio.trim() || current.bio,
        ville: aboutForm.ville.trim() || current.ville,
        quartier: aboutForm.quartier.trim() || current.quartier,
        atelier: aboutForm.atelier.trim() || current.atelier,
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
    } catch (error) {
      alert(getApiMessage(error, "Impossible d'enregistrer les informations."));
    }
  };

  const cancelAboutEdit = () => {
    setAboutForm({
      bio: artisan.bio,
      ville: artisan.ville,
      quartier: artisan.quartier,
      atelier: artisan.atelier,
      experience: artisan.experience,
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
                loading={portfolioLoading}
                uploading={portfolioUploading}
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
