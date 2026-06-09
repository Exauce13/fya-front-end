const keyPrefix = "fya-applied-offers";

const getKey = (userId) => `${keyPrefix}:${userId || "guest"}`;

export function getAppliedOfferIds(userId) {
  try {
    return JSON.parse(localStorage.getItem(getKey(userId)) || "[]");
  } catch {
    return [];
  }
}

export function setOfferApplied(userId, offerId) {
  const normalizedOfferId = String(offerId);
  const current = getAppliedOfferIds(userId).map(String);
  const next = current.includes(normalizedOfferId) ? current : [...current, normalizedOfferId];

  localStorage.setItem(getKey(userId), JSON.stringify(next));
}
