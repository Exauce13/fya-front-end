import apiClient, { getApiData } from "./apiClient";

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export async function getAdminOverview() {
  const response = await apiClient.get("/admin/overview");
  return getApiData(response);
}

export async function getAdminUsers(params = {}) {
  const response = await apiClient.get("/admin/users", { params });
  return getApiData(response);
}

export async function getAdminUser(userId) {
  const response = await apiClient.get(`/admin/users/${userId}`);
  return getApiData(response);
}

export async function suspendAdminUser(userId) {
  const response = await apiClient.patch(`/admin/users/${userId}/suspend`);
  return getApiData(response);
}

export async function activateAdminUser(userId) {
  const response = await apiClient.patch(`/admin/users/${userId}/activate`);
  return getApiData(response);
}

export async function getAdminVerifications(params = {}) {
  const response = await apiClient.get("/admin/verifications", { params });
  return getApiData(response);
}

export async function validateAdminVerification(artisanId) {
  const response = await apiClient.patch(`/admin/verifications/${artisanId}/validate`);
  return getApiData(response);
}

export async function cancelAdminVerification(artisanId) {
  const response = await apiClient.patch(`/admin/verifications/${artisanId}/cancel`);
  return getApiData(response);
}

export async function getAdminOffers(params = {}) {
  const response = await apiClient.get("/admin/offers", { params });
  return getApiData(response);
}

export async function deleteAdminOffer(offerId) {
  const response = await apiClient.delete(`/admin/offers/${offerId}`);
  return getApiData(response);
}

export async function getAdminReports(params = {}) {
  const response = await apiClient.get("/admin/reports", { params });
  return getApiData(response);
}

export async function markAdminReportAsTreated(reportId) {
  const response = await apiClient.patch(`/admin/reports/${reportId}/treated`);
  return getApiData(response);
}

export async function ignoreAdminReport(reportId) {
  const response = await apiClient.patch(`/admin/reports/${reportId}/ignored`);
  return getApiData(response);
}

export async function getAdminPayments(params = {}) {
  const response = await apiClient.get("/admin/payments", { params });
  return getApiData(response);
}

export async function downloadAdminPaymentReceipt(paymentId) {
  const response = await apiClient.get(`/admin/payments/${paymentId}/receipt`, {
    responseType: "blob",
  });
  downloadBlob(response.data, `recu-${paymentId}.pdf`);
}

export async function exportAdminPayments(params = {}) {
  const response = await apiClient.get("/admin/payments/export", {
    params,
    responseType: "blob",
  });
  downloadBlob(response.data, "paiements-fya.csv");
}

export async function createComplaint(data) {
  const targetType = data.target || data.cible || data.type || "user";
  const targetId = data.targetId || data.target_id || data.cible_id || data.userId;
  const reportedUserId =
    data.reportedUserId ||
    data.utilisateur_signale_id ||
    data.user_signale_id ||
    data.reported_user_id ||
    data.cible_user_id ||
    (targetType === "user" ? targetId : undefined);

  const response = await apiClient.post("/plaintes", {
    motif: data.reason,
    reason: data.reason,
    description: data.description,
    cible: targetType,
    cible_id: targetId,
    target: targetType,
    target_id: targetId,
    mise_en_cause_id: reportedUserId,
    user_id: reportedUserId,
    utilisateur_signale_id: reportedUserId,
    user_signale_id: reportedUserId,
    reported_user_id: reportedUserId,
    cible_user_id: reportedUserId,
    conversation_id: data.conversationId || data.conversation_id,
  });

  return getApiData(response);
}

export async function getNotifications() {
  const response = await apiClient.get("/notifications");
  return getApiData(response);
}

export async function getAdminNotifications(params = {}) {
  const response = await apiClient.get("/admin/notifications", { params });
  return response.data;
}

export async function markAllAdminNotificationsAsRead() {
  const response = await apiClient.patch("/admin/notifications/tout-lire");
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
