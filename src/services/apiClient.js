import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://192.168.1.85:8000/api";

const authTokenKey = "fya-auth-token";
const authUserKey = "fya-auth-user";
const authChangedEvent = "fya-auth-changed";

const notifyAuthChanged = () => {
  window.dispatchEvent(new Event(authChangedEvent));
};

export const authStorage = {
  eventName: authChangedEvent,
  getToken() {
    return localStorage.getItem(authTokenKey) || sessionStorage.getItem(authTokenKey);
  },
  setSession({ token, user }, remember = false) {
    const storage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;

    if (token) storage.setItem(authTokenKey, token);
    if (user) storage.setItem(authUserKey, JSON.stringify(user));
    otherStorage.removeItem(authTokenKey);
    otherStorage.removeItem(authUserKey);
    notifyAuthChanged();
  },
  setUser(user, remember = false) {
    const storage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;

    if (user) storage.setItem(authUserKey, JSON.stringify(user));
    otherStorage.removeItem(authUserKey);
    notifyAuthChanged();
  },
  getUser() {
    const value = localStorage.getItem(authUserKey) || sessionStorage.getItem(authUserKey);
    return value ? JSON.parse(value) : null;
  },
  clear() {
    localStorage.removeItem(authTokenKey);
    localStorage.removeItem(authUserKey);
    sessionStorage.removeItem(authTokenKey);
    sessionStorage.removeItem(authUserKey);
    notifyAuthChanged();
  },
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.clear();
    }

    return Promise.reject(error);
  }
);

export const getApiData = (response) => response.data?.data ?? response.data;

export const getStorageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${apiOrigin}/storage/${String(path).replace(/^\/?storage\/?/, "")}`;
};

export const getPaginatedItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.artisans)) return payload.artisans;
  if (Array.isArray(payload?.metiers)) return payload.metiers;
  const collectionKeys = ["users", "verifications", "offers", "reports", "payments", "appels_offres", "signalements", "paiements"];
  for (const key of collectionKeys) {
    if (Array.isArray(payload?.[key])) return payload[key];
    if (Array.isArray(payload?.[key]?.data)) return payload[key].data;
  }
  return [];
};

export const getApiMessage = (error, fallback = "Une erreur est survenue.") => {
  const data = error.response?.data;

  const validationErrors = data?.errors || data?.errorlist;
  if (validationErrors) {
    const firstError = Object.values(validationErrors).flat(Infinity)[0];
    if (firstError) return firstError;
  }

  if (typeof data?.error === "string") {
    return data.message ? `${data.message} : ${data.error}` : data.error;
  }

  if (data?.message) {
    if (typeof data.error === "string") return `${data.message} : ${data.error}`;
    return data.message;
  }

  if (error.code === "ERR_NETWORK") {
    return "Impossible de joindre le backend. Vérifiez l'adresse API et la configuration CORS Laravel.";
  }

  if (/failed to upload/i.test(error.message || "")) {
    return "Le fichier n'a pas pu être envoyé. Vérifiez sa taille et la limite upload_max_filesize/post_max_size du backend.";
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
};

export const getApiValidationErrors = (error) => {
  const validationErrors = error.response?.data?.errors || error.response?.data?.errorlist;

  if (!validationErrors || typeof validationErrors !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(validationErrors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages.join(" ") : String(messages || ""),
    ])
  );
};

export default apiClient;
