import apiClient, { getApiData } from "./apiClient";

export async function getClientOffers(clientId) {
  const response = await apiClient.get(`/clients/${clientId}/appels-offres`);
  return getApiData(response);
}

export async function getClientServices(clientId) {
  const response = await apiClient.get(`/clients/${clientId}/services`);
  return getApiData(response);
}

export async function getClientAvis(clientId) {
  const response = await apiClient.get(`/clients/${clientId}/avis`);
  return getApiData(response);
}
