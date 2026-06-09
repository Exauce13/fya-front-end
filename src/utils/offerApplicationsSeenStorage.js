const keyPrefix = "fya-seen-offer-applications";

const getKey = (userId) => `${keyPrefix}:${userId || "guest"}`;

const readSeenMap = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(getKey(userId)) || "{}");
  } catch {
    return {};
  }
};

export function getSeenOfferApplications(userId, offerId) {
  const seenMap = readSeenMap(userId);
  return Number(seenMap[String(offerId)] || 0);
}

export function setSeenOfferApplications(userId, offerId, count) {
  const seenMap = readSeenMap(userId);
  seenMap[String(offerId)] = Number(count || 0);
  localStorage.setItem(getKey(userId), JSON.stringify(seenMap));
}
