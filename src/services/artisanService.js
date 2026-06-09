import apiClient, { authStorage, getApiData, publicApiClient } from "./apiClient";

export async function getMetiers() {
  const response = await publicApiClient.get("/metiers");
  return getApiData(response);
}

export async function searchArtisans(params = {}) {
  const response = await apiClient.get("/users/recherche-artisans", { params });
  return getApiData(response);
}

export async function getFeedPosts() {
  const client = authStorage.getToken() ? apiClient : publicApiClient;
  const response = await client.get("/posts/feed");
  return getApiData(response);
}

export async function getArtisanPosts(artisanId) {
  const response = await publicApiClient.get(`/artisans/${artisanId}/posts`);
  return getApiData(response);
}

export async function getArtisanAvis(artisanId) {
  const response = await publicApiClient.get(`/artisans/${artisanId}/avis`);
  return getApiData(response);
}

export async function requestCertification(formData) {
  const response = await apiClient.post("/artisans/demande-certification", formData);

  return getApiData(response);
}
