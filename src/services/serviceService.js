import apiClient, { getApiData } from "./apiClient";

const servicePayload = (data) => {
  const payload = {
    client_id: data.clientId || data.client_id,
    message_id: data.messageId || data.message_id,
    appeloffer_id: data.offerId || data.appeloffer_id || null,
    titre: data.title || data.titre,
    description: data.description,
    montant: data.amount || data.montant,
    duree_service: data.duration || data.duree_service,
  };

  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
};

export async function createService(data) {
  const response = await apiClient.post("/services/services", servicePayload(data));

  return getApiData(response);
}

export async function getService(serviceId) {
  const response = await apiClient.get(`/services/${serviceId}`);
  return getApiData(response);
}

export async function updateService(serviceId, data) {
  const response = await apiClient.patch(`/services/${serviceId}`, servicePayload(data));
  return getApiData(response);
}

export async function validateService(serviceId) {
  const response = await apiClient.patch(`/services/${serviceId}/valider`);
  return getApiData(response);
}

export async function completeService(serviceId) {
  const response = await apiClient.patch(`/services/${serviceId}/terminer`);
  return getApiData(response);
}

export async function getClientServices(clientId) {
  const response = await apiClient.get(`/clients/${clientId}/services`);
  return getApiData(response);
}
