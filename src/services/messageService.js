import apiClient, { getApiData } from "./apiClient";

export async function getConversations() {
  const response = await apiClient.get("/messagerie/conversations");
  return getApiData(response);
}

export async function getConversationMessages(conversationId) {
  const response = await apiClient.get(`/messagerie/conversations/${conversationId}/messages`);
  return getApiData(response);
}

export async function sendMessage(conversationId, payload) {
  const response = await apiClient.post(`/messagerie/conversations/${conversationId}/messages`, payload);
  return getApiData(response);
}

export async function uploadMessageFile(formData) {
  const response = await apiClient.post("/messagerie/messages/upload", formData);
  return getApiData(response);
}

export async function uploadVoiceNote(formData) {
  const response = await apiClient.post("/messagerie/messages/voice/upload", formData);
  return getApiData(response);
}
