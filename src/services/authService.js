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

const normalizeRole = (user) => String(user?.statut || user?.role || "").toLowerCase();

const isAdminUser = (user) =>
  ["admin", "admins", "administrateur", "administrateurs"].includes(normalizeRole(user));

const buildOtpChallenge = (payload, email, remember = false) => ({
  requiresOtp: true,
  email,
  remember,
  message: payload?.message || "Un code OTP a ete envoye a votre adresse email.",
  expiresInMinutes: payload?.expires_in_minutes,
  redirectUrl: payload?.redirect_url,
  payload,
});

export async function requestAdminOtp(credentials) {
  const email = credentials.telemail || credentials.email;
  const response = await publicApiClient.post("/admin/login", {
    email,
    password: credentials.password,
  });
  const payload = getApiData(response);

  if (!payload?.requires_otp) {
    throw new Error(payload?.message || "Impossible d'envoyer le code OTP admin.");
  }

  return buildOtpChallenge(payload, email, credentials.remember);
}

export async function verifyAdminOtp({ email, otp, remember = false }) {
  const response = await publicApiClient.post("/admin/otp/verify", {
    email,
    otp,
  });
  const payload = getApiData(response);
  const token = extractToken(response.data) || extractToken(payload);
  const user = extractUser(response.data) || extractUser(payload);

  if (!token || !user) {
    throw new Error(response.data?.message || "Code OTP invalide ou expire.");
  }

  authStorage.setSession({ token, user }, remember);
  return { token, user, payload };
}

export async function login(credentials) {
  const response = await publicApiClient.post("/login", {
    email: credentials.telemail,
    password: credentials.password,
  });
  const payload = getApiData(response);
  if (payload?.requires_otp) {
    return buildOtpChallenge(payload, credentials.telemail, credentials.remember);
  }

  const token = extractToken(response.data) || extractToken(payload);
  const user = extractUser(response.data) || extractUser(payload);

  if (!token || !user) {
    throw new Error(response.data?.message || "Email ou mot de passe incorrect.");
  }

  if (isAdminUser(user)) {
    return requestAdminOtp(credentials);
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
