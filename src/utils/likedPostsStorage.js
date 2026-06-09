const keyPrefix = "fya-liked-posts";

const getKey = (userId) => `${keyPrefix}:${userId || "guest"}`;

export function getLikedPostIds(userId) {
  try {
    return JSON.parse(localStorage.getItem(getKey(userId)) || "[]");
  } catch {
    return [];
  }
}

export function isPostLiked(userId, postId) {
  return getLikedPostIds(userId).includes(Number(postId));
}

export function setPostLiked(userId, postId, liked) {
  const normalizedPostId = Number(postId);
  const current = getLikedPostIds(userId).filter((id) => id !== normalizedPostId);
  const next = liked ? [...current, normalizedPostId] : current;

  localStorage.setItem(getKey(userId), JSON.stringify(next));
}
