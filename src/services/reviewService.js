import apiClient, { getApiData } from "./apiClient";

export async function createReview(userId, data) {
  const response = await apiClient.post(`/avis/users/${userId}`, {
    note: data.rating || data.note,
    commentaire: data.comment || data.commentaire,
  });

  return getApiData(response);
}

export async function getArtisanReviews(artisanId) {
  const response = await apiClient.get(`/avis/artisans/${artisanId}`);
  return getApiData(response);
}

export async function getClientReviews(clientId) {
  const response = await apiClient.get(`/avis/clients/${clientId}`);
  return getApiData(response);
}
