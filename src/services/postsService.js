import apiClient, { getApiData, publicApiClient } from "./apiClient";

const normalizePostType = (postType) => {
  const value = String(postType || "service")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (value === "realisations") return "realisation";
  if (value === "services") return "service";
  return value || "service";
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

export async function createPost(payload) {
  const formData = payload instanceof FormData ? payload : buildPostFormData(payload);
  const response = await apiClient.post("/posts/creerposts", formData);
  return getApiData(response);
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
