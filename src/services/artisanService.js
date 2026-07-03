import apiClient, { authStorage, getApiData, publicApiClient } from "./apiClient";
import { serviceCategories } from "../data/serviceCategories";

const fallbackMetiers = serviceCategories.map((name, index) => ({
  id: index + 1,
  nom: name,
  name,
}));

export async function getMetiers() {
  try {
    const response = await publicApiClient.get("/metiers");
    return getApiData(response);
  } catch {
    return {
      success: false,
      metiers: fallbackMetiers,
      fallback: true,
    };
  }
}

export async function searchArtisans(params = {}) {
  const client = authStorage.getToken() ? apiClient : publicApiClient;

  try {
    const response = await client.get("/recherche-artisans", { params });
    return getApiData(response);
  } catch (error) {
    if (![401, 403, 404].includes(error.response?.status)) throw error;
    const response = await client.get("/users/recherche-artisans", { params });
    return getApiData(response);
  }
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

  return response.data;
}

export async function confirmCertificationPayment(reference, params = {}) {
  const response = await publicApiClient.get(`/fedapay/certification/${reference}/callback`, { params });

  return response.data;
}
