import apiClient, { authStorage, getApiData, publicApiClient } from "./apiClient";

const extractToken = (payload) =>
  payload?.token ||
  payload?.access_token ||
  payload?.plainTextToken ||
  payload?.data?.token ||
  payload?.data?.access_token;

const extractUser = (payload) =>
  payload?.user || payload?.data?.user || payload?.data || null;

const normalizePhone = (phone) =>
  phone
    ?.replace(/\s/g, "")
    .replace(/^\+229/, "")
    .replace(/^229/, "") || phone;
const normalizeBackendName = (name) =>
  name
    ?.trim()
    .replace(/\s+/g, " ")
    .replace(/[^A-Za-zÀ-ÿ\s'-]/g, "")
    .slice(0, 100) || name;
const normalizeLocation = (value) =>
  value
    ?.trim()
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-zÀ-ÿ-]/g, "")
    .slice(0, 50) || value;
const isNumericId = (value) => /^\d+$/.test(String(value || ""));

export async function login(credentials) {
  const response = await apiClient.post("/login", {
    email: credentials.telemail,
    password: credentials.password,
  });
  const payload = getApiData(response);
  const token = extractToken(response.data) || extractToken(payload);
  const user = extractUser(response.data) || extractUser(payload);

  if (!token || !user) {
    throw new Error(response.data?.message || "Email ou mot de passe incorrect.");
  }

  authStorage.setSession({ token, user }, credentials.remember);
  return { token, user, payload };
}

export async function logout() {
  try {
    await apiClient.post("/users/logout");
  } finally {
    authStorage.clear();
  }
}

export async function registerClient(data) {
  const response = await publicApiClient.post("/register/client", {
    name: normalizeBackendName(data.name),
    nom: data.name,
    full_name: data.name,
    telephone: normalizePhone(data.tel),
    email: data.email,
    password: data.password,
    password_confirmation: data.confirm_password,
    confirm_password: data.confirm_password,
    statut: "clients",
  });

  const payload = getApiData(response);
  const token = extractToken(response.data) || extractToken(payload);
  const user = extractUser(response.data) || extractUser(payload);

  if (token && user) {
    authStorage.setSession({ token, user }, false);
    return { ...payload, token, user };
  }

  try {
    const session = await login({
      telemail: data.email,
      password: data.password,
      remember: false,
    });

    return { ...payload, token: session.token, user: session.user };
  } catch {
    authStorage.clear();
    return payload;
  }
}

export async function registerArtisan(data) {
  const metierValue = data.metier;
  const response = await publicApiClient.post("/register/artisan", {
    name: normalizeBackendName(data.full_name),
    nom: data.full_name,
    full_name: data.full_name,
    npi: data.npi,
    telephone: normalizePhone(data.tel),
    email: data.email,
    ...(isNumericId(metierValue)
      ? { metier_id: Number(metierValue) }
      : { metier_nom: metierValue }),
    annees_experiences: Number(data.experience_years),
    ville: normalizeLocation(data.ville),
    quartier: normalizeLocation(data.quartier),
    password: data.password,
    password_confirmation: data.confirm_password,
    confirm_password: data.confirm_password,
    statut: "artisans",
  });

  const payload = getApiData(response);
  const token = extractToken(response.data) || extractToken(payload);
  const user = extractUser(response.data) || extractUser(payload);

  if (token && user) {
    authStorage.setSession({ token, user }, false);
    return { ...payload, token, user };
  }

  try {
    const session = await login({
      telemail: data.email,
      password: data.password,
      remember: false,
    });

    return { ...payload, token: session.token, user: session.user };
  } catch {
    authStorage.clear();
    return payload;
  }
}

export async function updatePassword(data) {
  const response = await apiClient.patch("/users/updatepassword", {
    old_password: data.currentPassword,
    new_password: data.newPassword,
    new_password_confirmation: data.confirmPassword,
  });

  return getApiData(response);
}

export async function requestPasswordReset(email) {
  const response = await publicApiClient.post("/forgot-password", {
    email,
  });

  return getApiData(response);
}

export async function resetPassword(data) {
  const response = await publicApiClient.post("/reset-password", {
    token: data.token,
    email: data.email,
    password: data.password,
    password_confirmation: data.confirm_password,
    confirm_password: data.confirm_password,
  });

  return getApiData(response);
}
