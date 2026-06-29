import apiClient, { getApiData, publicApiClient } from "./apiClient";

const normalizePostType = (postType) => {
  const value = String(postType || "service")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (["realisation", "realisations"].includes(value)) return "realisations";
  if (["service", "services"].includes(value)) return "services";
  if (value === "promotion") return "promotion";
  return "services";
};

const buildPostFormData = ({ description = "", postType = "service", media = [] }) => {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("post_type", normalizePostType(postType));

  media.forEach((file) => {
    formData.append("media_json[]", file, file.name);
  });

  return formData;
};

const throwIfApiFailed = (payload) => {
  if (payload?.success !== false) return;

  const validationErrors = payload.errorlist || payload.errors;
  const firstError = validationErrors
    ? Object.values(validationErrors).flat(Infinity)[0]
    : "";

  throw new Error(firstError || payload.message || "Impossible d'enregistrer la publication.");
};

export async function createPost(payload) {
  const formData = payload instanceof FormData ? payload : buildPostFormData(payload);
  const response = await apiClient.post("/posts/creerposts", formData);
  const data = getApiData(response);
  throwIfApiFailed(data);
  return data;
}

export async function likePost(postId) {
  const response = await apiClient.post(`/posts/${postId}/like`);
  return getApiData(response);
}

export async function getPostComments(postId) {
  try {
    const response = await publicApiClient.get(`/${postId}/commentaires`);
    return getApiData(response);
  } catch (error) {
    if (![401, 403, 404].includes(error.response?.status)) throw error;
    const response = await publicApiClient.get(`/posts/${postId}/commentaires`);
    return getApiData(response);
  }
}

export async function createComment({ postId, text }) {
  const response = await apiClient.post("/posts/commentaires", {
    post_id: postId,
    comments: text,
    content: text,
  });

  return getApiData(response);
}
