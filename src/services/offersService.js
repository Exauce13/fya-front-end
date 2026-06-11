import apiClient, { getApiData, getPaginatedItems, getStorageUrl } from "./apiClient";

const createdOffersKey = (userId) => `fya-created-offers:${userId || "current"}`;

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
};

const formatBudget = (budget) => {
  if (budget === null || budget === undefined || budget === "") return "Non precise";
  const number = Number(budget);
  return Number.isFinite(number) ? `${number.toLocaleString("fr-FR")} FCFA` : String(budget);
};

const getFileValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value !== "object") return "";

  return (
    value.url ||
    value.path ||
    value.src ||
    value.file ||
    value.filename ||
    value.name ||
    ""
  );
};

const looksLikeQuoteFile = (value) => {
  const text = String(value || "").trim();
  if (!text) return false;
  if (/^\d+([.,]\d+)?$/.test(text)) return false;

  return (
    /\.pdf($|\?)/i.test(text) ||
    /^https?:\/\//i.test(text) ||
    text.includes("/") ||
    text.includes("\\") ||
    text.startsWith("storage/")
  );
};

const quoteFieldPattern = /(devis|pdf|fichier|file|piece|document|attachment|jointe)/i;

const findQuoteFileFromApplication = (application = {}) => {
  const ignoredKeys = new Set(["artisan", "appelOffre", "appel_offre", "user", "client"]);

  return Object.entries(application).reduce((found, [key, value]) => {
    if (found || ignoredKeys.has(key) || !quoteFieldPattern.test(key)) return found;

    const candidates = asArray(value).map(getFileValue);
    const directCandidate = candidates.find(looksLikeQuoteFile);
    if (directCandidate) return directCandidate;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.values(value).map(getFileValue).find(looksLikeQuoteFile) || found;
    }

    return found;
  }, "");
};

const getApplicationQuoteFile = (application = {}) => {
  const directCandidates = [
    application.devis_pdf,
    application.devisPdf,
    application.devis_file,
    application.devisFile,
    application.devis_path,
    application.devisPath,
    application.devis_url,
    application.devisUrl,
    application.fichier_devis,
    application.fichierDevis,
    application.fichier_pdf,
    application.fichierPdf,
    application.piece_jointe,
    application.pieceJointe,
    application.attachment,
    application.attachment_url,
    application.document,
    application.devis,
    application.devis_propose,
    application.devisPropose,
  ];

  const nestedCandidates = [
    application.files,
    application.fichiers,
    application.attachments,
    application.documents,
    application.pieces_jointes,
  ]
    .flatMap((value) => asArray(value))
    .map(getFileValue);

  const value =
    [...directCandidates.map(getFileValue), ...nestedCandidates].find(looksLikeQuoteFile) ||
    findQuoteFileFromApplication(application);

  if (!value) return null;

  return {
    name: String(value).split("/").pop() || "devis.pdf",
    src: getStorageUrl(value),
  };
};

export const normalizeOffer = (offer = {}, owner = false) => {
  const applications = asArray(offer.candidatures || offer.applications || offer.candidature);
  const media = asArray(offer.appel_json || offer.media_json).map((path) => {
    const value = typeof path === "string" ? path : path?.url || path?.path || path?.src || "";

    return {
      name: String(value).split("/").pop() || "media",
      src: getStorageUrl(value),
      type: /\.(mp4|mov|webm|avi)$/i.test(value) ? "video" : "image",
    };
  });

  return {
    id: offer.id,
    title: offer.titre || offer.title || "Appel d'offres",
    category: offer.metier?.nom || offer.metier_nom || offer.category || "",
    categoryId: offer.metier_id || offer.metier?.id || offer.categoryId || "",
    location: offer.ville || offer.location || "",
    budget: formatBudget(offer.budget),
    rawBudget: offer.budget ?? "",
    proposals: offer.candidatures_count || offer.applications_count || applications.length || 0,
    publishedAgo: offer.created_at ? new Date(offer.created_at).toLocaleDateString("fr-FR") : "",
    status: offer.status || "open",
    description: offer.description || "",
    owner,
    userId: offer.user_id || offer.user?.id || offer.ownerId,
    raw: offer,
    applicants: applications.map((item) => ({
      id: item.id,
      artisanId: item.artisan_id || item.artisan?.id,
      userId: item.user_id || item.artisan?.user_id || item.artisan?.user?.id,
      name: item.artisan?.user?.name || item.artisan?.name || "Artisan",
      trade: offer.metier?.nom || "",
      city: item.artisan?.user?.ville || item.artisan?.ville || "",
      rating: item.artisan?.rating || "0",
      description: item.description || "",
      proposedAmount: item.devis_propose ?? item.montant ?? item.amount ?? "",
      quoteFile: getApplicationQuoteFile(item),
      status: item.statut || item.status || "en_attente",
      state: item.artisan
        ? {
            artisan: {
              id: item.artisan.id,
              userId: item.artisan?.user_id || item.artisan?.user?.id || "",
              name: item.artisan?.user?.name || item.artisan?.name || "Artisan",
              job: offer.metier?.nom || "",
              category: offer.metier?.nom || "",
              city: item.artisan?.user?.ville || item.artisan?.ville || "",
              district: item.artisan?.user?.quartier || item.artisan?.quartier || "",
              bio: item.artisan?.bio || "",
              workshop: item.artisan?.nom_atelier || item.artisan?.nom_association || "",
              telephone: item.artisan?.user?.telephone || item.artisan?.telephone || "",
              email: item.artisan?.user?.email || "",
              statut: item.artisan?.user?.statut || "",
              image: getStorageUrl(item.artisan?.user?.photo),
              verified: Boolean(item.artisan?.is_certifed || item.artisan?.is_certified),
              experience: `${item.artisan?.annees_experiences || 0} an(s) d'expérience`,
            },
          }
        : undefined,
      raw: item,
    })),
    photos: media,
  };
};

export const getOfferItems = (payload) => {
  if (Array.isArray(payload?.appels_offres?.data)) return payload.appels_offres.data;
  if (Array.isArray(payload?.data?.appels_offres?.data)) return payload.data.appels_offres.data;
  if (Array.isArray(payload?.appel_offres?.data)) return payload.appel_offres.data;
  if (Array.isArray(payload?.data?.appel_offres?.data)) return payload.data.appel_offres.data;
  return getPaginatedItems(payload);
};

export const extractCreatedOffer = (payload) =>
  payload?.appel_offre || payload?.data?.appel_offre || payload?.offer || payload?.data || payload;

export const saveCreatedOffer = (userId, offer) => {
  if (!offer?.id || typeof window === "undefined") return;

  const key = createdOffersKey(userId);
  const current = readCreatedOffers(userId);
  const next = [offer, ...current.filter((item) => item.id !== offer.id)].slice(0, 50);
  localStorage.setItem(key, JSON.stringify(next));
};

export const readCreatedOffers = (userId) => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(createdOffersKey(userId)) || "[]");
  } catch {
    return [];
  }
};

export const buildOfferFormData = (form) => {
  const formData = new FormData();
  const categoryId = Number(form.categoryId);
  const budget = String(form.budget || "").replace(/[^\d]/g, "");

  formData.append("titre", form.title.trim());
  formData.append("ville", form.location.trim());
  formData.append("budget", budget || "0");
  formData.append("description", form.description.trim());

  if (Number.isFinite(categoryId) && categoryId > 0) {
    formData.append("metier_id", String(categoryId));
  } else {
    formData.append("metier_nom", form.category.trim());
  }

  form.photos.forEach((photo) => {
    if (photo.file) {
      formData.append("appel_json[]", photo.file, photo.file.name);
    }
  });

  return formData;
};

const buildApplicationFormData = (payload = {}) => {
  const formData = new FormData();
  const quoteFile = payload.devis_propose || payload.devis_pdf;

  formData.append("description", payload.description || "");

  if (quoteFile) {
    formData.append("devis_propose", quoteFile, quoteFile.name);
  }

  return formData;
};

export async function getOfferFeed(params = {}) {
  const response = await apiClient.get("/appeloffres/feed-appels-offres", { params });
  return getApiData(response);
}

export async function getMyOffers(params = {}) {
  const response = await apiClient.get("/appeloffres/mes-appels-offres", { params });
  return getApiData(response);
}

export async function getMyOfferById(offerId) {
  const payload = await getMyOffers();
  const offer = getOfferItems(payload).find((item) => String(item.id) === String(offerId));
  return offer ? normalizeOffer(offer, true) : null;
}

export async function createOffer(formData) {
  const response = await apiClient.post("/appeloffres/appeloffres", formData);

  return getApiData(response);
}

export async function closeOffer(id) {
  const response = await apiClient.patch(`/appeloffres/closeappel/${id}`);
  return getApiData(response);
}

export async function applyToOffer(offerId, payload = {}) {
  const hasPdfFile =
    typeof File !== "undefined" &&
    (payload?.devis_propose instanceof File || payload?.devis_pdf instanceof File);
  const body = payload instanceof FormData ? payload : hasPdfFile ? buildApplicationFormData(payload) : payload;
  const response = await apiClient.post(`/appeloffres/appels-offres/${offerId}/postuler`, body);
  return getApiData(response);
}

export async function acceptApplication(applicationId) {
  const response = await apiClient.patch(`/appeloffres/candidatures/${applicationId}/accepter`);
  return getApiData(response);
}
