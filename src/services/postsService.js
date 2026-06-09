import apiClient, { getApiData } from "./apiClient";

const buildPostFormData = ({ description = "", postType = "services", media = [] }) => {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("post_type", postType);

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
  const response = await apiClient.get(`/posts/${postId}/commentaires`);
  return getApiData(response);
}

export async function createComment({ postId, text }) {
  const response = await apiClient.post("/posts/commentaires", {
    post_id: postId,
    comments: text,
    content: text,
  });

  return getApiData(response);
}
