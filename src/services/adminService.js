import apiClient, { getApiData } from "./apiClient";

export async function createComplaint(data) {
  const response = await apiClient.post("/plaintes", {
    motif: data.reason,
    description: data.description,
    cible: data.target,
    target_id: data.targetId,
  });

  return getApiData(response);
}

export async function getNotifications() {
  const response = await apiClient.get("/notifications");
  return getApiData(response);
}

export async function markAllNotificationsAsRead() {
  const response = await apiClient.patch("/notifications/tout-lire");
  return getApiData(response);
}

export async function markNotificationAsRead(notificationId) {
  const response = await apiClient.patch(`/notifications/${notificationId}/lire`);
  return getApiData(response);
}
