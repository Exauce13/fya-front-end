import apiClient, { authStorage, getApiData } from "./apiClient";

const normalizeLocation = (value) =>
  value
    ?.trim()
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-zÀ-ÿ-]/g, "")
    .slice(0, 50) || value;

const normalizeProfilePayload = (data) => ({
  ...data,
  ...(data.ville !== undefined ? { ville: normalizeLocation(data.ville) } : {}),
  ...(data.quartier !== undefined ? { quartier: normalizeLocation(data.quartier) } : {}),
});

export async function updateProfilePhoto(formData) {
  const response = await apiClient.post("/users/profile/photo", formData);
  const payload = getApiData(response);

  if (payload?.user) {
    authStorage.setUser(payload.user);
  }

  return payload;
}

export async function updateProfileInformation(userId, data) {
  const response = await apiClient.put(`/users/updateinformation/${userId}`, normalizeProfilePayload(data));
  const payload = getApiData(response);

  if (payload?.user) {
    authStorage.setUser(payload.user);
  }

  return payload;
}
