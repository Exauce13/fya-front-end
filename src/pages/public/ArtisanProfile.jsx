import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Rows3, Star } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AboutSection from "../../components/artisan/AboutSection";
import ArtisanHeader from "../../components/artisan/ArtisanHeader";
import ArtisanPublications from "../../components/artisan/ArtisanPublications";
import PortfolioGallery from "../../components/artisan/PortfolioGallery";
import ReviewSection from "../../components/artisan/ReviewSection";
import { artisans, homeAssets } from "../../components/home/homeData";
import { useUserMode } from "../../context/useUserMode";
import { getApiMessage, getPaginatedItems, getStorageUrl } from "../../services/apiClient";
import { getArtisanAvis, getArtisanPosts, getMetiers, searchArtisans } from "../../services/artisanService";
import { updatePassword } from "../../services/authService";
import { createPost } from "../../services/postsService";
import { updateProfileInformation, updateProfilePhoto as uploadProfilePhoto } from "../../services/profileService";
import { getArtisanServices } from "../../services/serviceService";
import profileAvatar from "../../assets/images/profile-avatar.svg";
import {
  hasPasswordErrors,
  validatePasswordChange,
} from "../../utils/passwordValidation";

const defaultArtisan = {
  id: "",
  userId: "",
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

const allowedRealizationExtensions = /\.(jpe?g|png|webp)$/i;

const getPostItems = (payload) => {
  if (Array.isArray(payload?.posts?.data)) return payload.posts.data;
  if (Array.isArray(payload?.posts)) return payload.posts;
  if (Array.isArray(payload?.data?.posts?.data)) return payload.data.posts.data;
  if (Array.isArray(payload?.data?.posts)) return payload.data.posts;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.postes?.data)) return payload.postes.data;
  if (Array.isArray(payload?.postes)) return payload.postes;
  if (Array.isArray(payload?.data?.postes?.data)) return payload.data.postes.data;
  if (Array.isArray(payload?.data?.postes)) return payload.data.postes;
  if (Array.isArray(payload)) return payload;
  return [];
};

const normalizePostType = (post) =>
  String(post.post_type || post.type || post.postType || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const isRealizationPost = (post) => ["realisation", "realisations"].includes(normalizePostType(post));

const normalizeMetierName = (...values) => {
  for (const value of values) {
    if (!value) continue;
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      const name =
        value.nom ||
        value.name ||
        value.libelle ||
        value.label ||
        value.titre ||
        value.title;
      if (name) return name;
    }
  }

  return "";
};

const getMetierId = (...values) => {
  for (const value of values) {
    if (!value) continue;
    if (typeof value === "object" && value.id) return value.id;
    if (typeof value === "number" || /^\d+$/.test(String(value))) return value;
  }

  return "";
};

const asMediaArray = (media) => {
  if (!media) return [];
  if (Array.isArray(media)) return media;

  if (typeof media === "string") {
    try {
      const parsed = JSON.parse(media);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [media];
    }
  }

  return [media];
};

const normalizeRealizationImages = (posts) =>
  posts
    .filter(isRealizationPost)
    .flatMap((post) => asMediaArray(post.media_json || post.media_urls || post.media))
    .map((path) => {
      const source = path?.src || path?.url || path?.path || path;
      const value = String(source).replace(/^\/?storage\/?/, "");
      return {
        src: path?.src || getStorageUrl(source),
        name: value.split("/").pop() || "realisation",
      };
    });

const getAvisItems = (payload) => {
  if (Array.isArray(payload?.data?.avis)) return payload.data.avis;
  if (Array.isArray(payload?.avis)) return payload.avis;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const normalizeReview = (review = {}) => {
  const author = review.auteur || review.author || review.user || {};
  const note = review.note ?? review.rating ?? 0;

  return {
    id: review.id || `${author.id || author.name || "avis"}-${review.created_at || Date.now()}`,
    author: author.name || review.author_name || "Utilisateur FYA",
    authorId: author.id || review.auteur_id || "",
    avatar: getStorageUrl(author.photo || author.avatar) || profileAvatar,
    rating: `${Number(note) || 0}/5`,
    comment: review.commentaire || review.comment || review.text || "",
    date: review.created_at ? new Date(review.created_at).toLocaleDateString("fr-FR") : "",
  };
};

const getAvisStats = (payload) => payload?.data?.stats || payload?.stats || {};

const getCompletedServicesCount = (...sources) => {
  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    const value =
      source.services_termines_count ??
      source.servicesTerminesCount ??
      source.prestations_realisees_count ??
      source.prestationsRealiseesCount ??
      source.prestations_count ??
      source.prestationsCount ??
      source.completed_services_count ??
      source.completedServicesCount ??
      source.services_count ??
      source.servicesCount;

    if (value !== null && value !== undefined && value !== "") {
      return Number(value) || 0;
    }
  }

  return 0;
};

const getCompletedServicesCountFromPayload = (payload) => {
  const data = payload?.data || payload || {};
  const counts = data.comptes || data.counts || {};
  const finished =
    counts.terminer ??
    counts.termine ??
    counts.termines ??
    data.services_termines_count ??
    data.completed_services_count;

  if (finished !== null && finished !== undefined && finished !== "") {
    return Number(finished) || 0;
  }

  if (Array.isArray(data.services?.terminer)) return data.services.terminer.length;
  return null;
};

const normalizeVisitedArtisan = (artisan = {}, fallbackId = "") => {
  const raw = artisan.raw || artisan;
  const user = raw.user || artisan.user || {};
  const experience = raw.annees_experiences ?? artisan.annees_experiences ?? artisan.experience ?? 0;

  return {
    id: raw.id || artisan.id || fallbackId,
    userId: artisan.userId || raw.user_id || user.id || "",
    name: artisan.name || user.name || raw.name || "",
    metier: normalizeMetierName(raw.metier, user.metier, artisan.job, artisan.category, raw.metier_nom, user.metier_nom),
    ville: artisan.city || raw.ville || user.ville || "",
    quartier: artisan.district || raw.quartier || user.quartier || "",
    atelier: artisan.workshop || raw.nom_atelier || raw.nom_association || "",
    experience: Number.parseInt(experience, 10) || 0,
    bio: artisan.bio || raw.bio || "",
    photo: getStorageUrl(artisan.image || raw.photo || user.photo) || profileAvatar,
    verified: Boolean(artisan.verified || raw.is_certifed || raw.is_certified),
    rating: `${artisan.rating || raw.rating || 0}/5`,
    reviews: Number(artisan.reviews || raw.reviews || 0),
    services: getCompletedServicesCount(artisan, raw, user),
    email: artisan.email || user.email || raw.email || "",
    telephone: artisan.telephone || user.telephone || raw.telephone || "",
    statut: artisan.statut || user.statut || raw.statut || "",
  };
};

const normalizeBackendArtisan = (backendArtisan = {}, metiersById = {}) => {
  const user = backendArtisan.user || {};
  const metier = backendArtisan.metier || user.metier || {};
  const metierId = getMetierId(metier, backendArtisan.metier_id, user.metier_id);

  return {
    id: backendArtisan.id || backendArtisan.artisan_id || "",
    userId: backendArtisan.user_id || user.id || "",
    prenom: user.name || backendArtisan.name || backendArtisan.nom || "Artisan FYA",
    metier:
      normalizeMetierName(metier, backendArtisan.metier_nom, user.metier_nom, backendArtisan.job, backendArtisan.category) ||
      metiersById[String(metierId)] ||
      "",
    ville: user.ville || backendArtisan.ville || backendArtisan.city || "",
    quartier: user.quartier || backendArtisan.quartier || backendArtisan.district || "",
    atelier: backendArtisan.nom_atelier || backendArtisan.nom_association || backendArtisan.atelier || backendArtisan.workshop || "",
    experience: Number(backendArtisan.annees_experiences || 0),
    bio: backendArtisan.bio || user.bio || "",
    photo: getStorageUrl(user.photo || backendArtisan.photo) || profileAvatar,
    verified: Boolean(backendArtisan.is_certifed || backendArtisan.is_certified),
    services: getCompletedServicesCount(backendArtisan, user),
    email: user.email || backendArtisan.email || "",
    telephone: user.telephone || backendArtisan.telephone || "",
    statut: user.statut || backendArtisan.statut || "",
  };
};

const hasMeaningfulValue = (value) => value !== "" && value !== null && value !== undefined;

const mergeMeaningfulProfile = (current, next) => ({
  ...current,
  ...Object.fromEntries(
    Object.entries(next).filter(([key, value]) => {
      if (!hasMeaningfulValue(value)) return false;
      if (["experience", "reviews", "services"].includes(key) && Number(value) === 0 && Number(current[key]) > 0) {
        return false;
      }
      if (key === "rating" && String(value) === "0/5" && current.rating && current.rating !== "0/5") {
        return false;
      }
      return true;
    })
  ),
});

const resolveOwnArtisanId = (user = {}, artisanData = {}) =>
  artisanData.id ||
  user.artisan_id ||
  user.artisan_p?.id ||
  user.artisanP?.id ||
  user.artisan_profile?.id ||
  user.artisanProfile?.id ||
  user.artisan?.id ||
  "";

const resolveOwnMetierId = (user = {}, artisanData = {}) =>
  artisanData.metier_id ||
  artisanData.metier?.id ||
  user.metier_id ||
  user.metier?.id ||
  "";

const buildRoutedArtisanSeed = (slug) => ({
  ...defaultArtisan,
  id: slug || "",
});

export default function ArtisanProfile() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserMode();
  const routedArtisan = location.state?.artisan;
  const publicArtisan = artisans.find((item) => item.slug === slug);
  const artisanData = useMemo(() => user?.artisan || user?.artisan_p || {}, [user]);
  const [metiersById, setMetiersById] = useState({});
  const metier = useMemo(() => {
    const metierId = getMetierId(artisanData.metier, artisanData.metier_id, user?.metier, user?.metier_id);
    return (
      normalizeMetierName(artisanData.metier, user?.metier, artisanData.metier_nom, user?.metier_nom, user?.trade) ||
      metiersById[String(metierId)] ||
      ""
    );
  }, [artisanData, metiersById, user]);
  const fullName = user?.name || "";
  const memberSince = user?.created_at ? new Date(user.created_at).getFullYear().toString() : "";
  const ownProfileSeed = useMemo(() => ({
    ...defaultArtisan,
    id: resolveOwnArtisanId(user, artisanData),
    userId: user?.id || artisanData.user_id || "",
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
    services: getCompletedServicesCount(user, artisanData),
    memberSince,
    email: user?.email || "",
    telephone: user?.telephone || "",
    statut: user?.statut || "",
  }), [artisanData, fullName, memberSince, metier, user]);
  const visitedArtisan = routedArtisan ? normalizeVisitedArtisan(routedArtisan, slug) : null;
  const profileSeed = visitedArtisan
    ? {
        ...defaultArtisan,
        id: visitedArtisan.id,
        userId: visitedArtisan.userId,
        nom: "",
        prenom: visitedArtisan.name || defaultArtisan.prenom,
        metier: visitedArtisan.metier,
        ville: visitedArtisan.ville,
        quartier: visitedArtisan.quartier,
        atelier: visitedArtisan.atelier,
        experience: visitedArtisan.experience,
        bio: visitedArtisan.bio,
        photo: visitedArtisan.photo,
        verified: visitedArtisan.verified,
        rating: visitedArtisan.rating,
        reviews: visitedArtisan.reviews,
        email: visitedArtisan.email,
        telephone: visitedArtisan.telephone,
        statut: visitedArtisan.statut,
      }
    : publicArtisan
    ? {
        ...defaultArtisan,
        id: publicArtisan.id || slug,
        userId: publicArtisan.userId || "",
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
    : slug
    ? buildRoutedArtisanSeed(slug)
    : ownProfileSeed;
  const [artisan, setArtisan] = useState(profileSeed);
  const [verificationPending] = useState(() => (
    !profileSeed.verified && localStorage.getItem(verificationStatusKey) === "pending"
  ));
  const [activeFilter, setActiveFilter] = useState("all");
  const [visitorMode] = useState(Boolean(slug || publicArtisan || routedArtisan));
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
  const [profileReviews, setProfileReviews] = useState([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioUploading, setPortfolioUploading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadMetiers() {
      try {
        const payload = await getMetiers();
        const nextMetiersById = Object.fromEntries(
          getPaginatedItems(payload)
            .map((item) => [String(item.id), normalizeMetierName(item)])
            .filter(([id, name]) => id && name)
        );
        if (active) setMetiersById(nextMetiersById);
      } catch {
        if (active) setMetiersById({});
      }
    }

    loadMetiers();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (visitorMode || artisan.id || !user?.id) return;

    let active = true;

    async function discoverOwnArtisanProfile() {
      const metierId = resolveOwnMetierId(user, artisanData);

      try {
        const payload = await searchArtisans(metierId ? { metier_id: metierId } : {});
        const foundArtisan = getPaginatedItems(payload).find((item) => {
          const itemUserId = item.user_id || item.user?.id;
          return String(itemUserId || "") === String(user.id);
        });

        if (active && foundArtisan) {
          setArtisan((current) => mergeMeaningfulProfile(current, normalizeBackendArtisan(foundArtisan, metiersById)));
        }
      } catch {
        // Le profil reste base sur les donnees de session si la recherche echoue.
      }
    }

    discoverOwnArtisanProfile();

    return () => {
      active = false;
    };
  }, [artisan.id, artisanData, metiersById, user, visitorMode]);

  useEffect(() => {
    if (visitorMode) return;

    let active = true;

    queueMicrotask(() => {
      if (!active) return;

      setArtisan((current) => mergeMeaningfulProfile(current, ownProfileSeed));

      if (!editingAbout) {
        setAboutForm((current) => ({
          ...current,
          bio: ownProfileSeed.bio || current.bio,
          ville: ownProfileSeed.ville || current.ville,
          quartier: ownProfileSeed.quartier || current.quartier,
          atelier: ownProfileSeed.atelier || current.atelier,
          experience: ownProfileSeed.experience || current.experience,
        }));
      }
    });

    return () => {
      active = false;
    };
  }, [editingAbout, ownProfileSeed, visitorMode]);

  useEffect(() => {
    if (!artisan.id) return;

    let active = true;

    async function loadPortfolio() {
      setPortfolioLoading(true);
      try {
        const [postsResponse, avisResponse, servicesResponse] = await Promise.allSettled([
          getArtisanPosts(artisan.id),
          getArtisanAvis(artisan.id),
          getArtisanServices(artisan.id),
        ]);

        if (active) {
          const postsPayload = postsResponse.status === "fulfilled" ? postsResponse.value : null;
          const avisPayload = avisResponse.status === "fulfilled" ? avisResponse.value : null;
          const servicesPayload = servicesResponse.status === "fulfilled" ? servicesResponse.value : null;
          const backendArtisan =
            postsPayload?.artisan ||
            postsPayload?.data?.artisan ||
            avisPayload?.artisan ||
            avisPayload?.data?.artisan ||
            servicesPayload?.artisan ||
            servicesPayload?.data?.artisan;

          if (backendArtisan) {
            const nextArtisan = normalizeBackendArtisan(backendArtisan, metiersById);
            setArtisan((current) => mergeMeaningfulProfile(current, nextArtisan));
            if (!visitorMode && !editingAbout) {
              setAboutForm((current) => ({
                ...current,
                bio: nextArtisan.bio || current.bio,
                ville: nextArtisan.ville || current.ville,
                quartier: nextArtisan.quartier || current.quartier,
                atelier: nextArtisan.atelier || current.atelier,
                experience: nextArtisan.experience || current.experience,
              }));
            }
          }

          const avisItems = getAvisItems(avisPayload).map(normalizeReview);
          const avisStats = getAvisStats(avisPayload);
          const completedServices = getCompletedServicesCountFromPayload(servicesPayload);
          setProfileReviews(avisItems);
          setArtisan((current) => mergeMeaningfulProfile(current, {
            reviews: Number(avisStats.total_avis ?? avisItems.length),
            rating: avisStats.moyenne_note !== null && avisStats.moyenne_note !== undefined
              ? `${Number(avisStats.moyenne_note).toFixed(1)}/5`
              : current.rating,
            ...(completedServices !== null ? { services: completedServices } : {}),
          }));
          setPortfolio(normalizeRealizationImages(getPostItems(postsPayload)));
        }
      } catch {
        if (active) {
          setPortfolio([]);
          setProfileReviews([]);
        }
      } finally {
        if (active) setPortfolioLoading(false);
      }
    }

    loadPortfolio();

    return () => {
      active = false;
    };
  }, [artisan.id, editingAbout, metiersById, visitorMode]);

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

  const openConversation = () => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    if (!artisan.userId) {
      alert("Impossible d'ouvrir la discussion : l'utilisateur de cet artisan est introuvable.");
      return;
    }

    if (String(artisan.userId) === String(user.id)) {
      navigate("/profile");
      return;
    }

    navigate(`/messages?contact=${encodeURIComponent(artisan.userId)}`, {
      state: {
        contact: {
          userId: artisan.userId,
          profileId: artisan.id,
          userType: "artisan",
          name: [artisan.prenom, artisan.nom].filter(Boolean).join(" ") || "Artisan",
          avatar: artisan.photo,
          artisan,
        },
      },
    });
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
        description: "Réalisation",
        postType: "realisation",
        media: selectedFiles,
      });
      const nextItems = normalizeRealizationImages([
        {
          ...(payload?.post || {}),
          media_json: payload?.post?.media_json || payload?.media_urls || [],
          post_type: payload?.post?.post_type || "realisation",
        },
      ]);
      const fallbackItems = selectedFiles.map((file) => ({
        src: URL.createObjectURL(file),
        name: file.name,
      }));

      setPortfolio((current) => [...(nextItems.length ? nextItems : fallbackItems), ...current]);
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
          onContact={openConversation}
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
              <ReviewSection
                reviews={profileReviews}
                rating={artisan.rating}
                canReport={visitorMode}
                targetId={artisan.id}
                targetType="artisan"
                targetUserId={artisan.userId}
              />
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
            <ReviewSection
              reviews={profileReviews}
              rating={artisan.rating}
              canReport={visitorMode}
              targetId={artisan.id}
              targetType="artisan"
              targetUserId={artisan.userId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
