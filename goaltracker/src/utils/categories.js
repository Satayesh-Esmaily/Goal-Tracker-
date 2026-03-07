const CATEGORY_STORAGE_KEY = "goal-tracker-custom-categories-v1";

export const DEFAULT_CATEGORIES = [
  "Health",
  "Study",
  "Work",
  "Personal",
  "Fitness",
  "Hobby",
];

function getStorageKey(userId) {
  return userId ? `${CATEGORY_STORAGE_KEY}:${userId}` : CATEGORY_STORAGE_KEY;
}

export function readCustomCategories(userId) {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function writeCustomCategories(userId, categories) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(categories));
}

export function addCustomCategory(userId, name) {
  const trimmed = String(name || "").trim();
  if (!trimmed) {
    return { ok: false, reason: "empty" };
  }

  const current = readCustomCategories(userId);
  const exists = [...DEFAULT_CATEGORIES, ...current].some(
    (cat) => cat.toLowerCase() === trimmed.toLowerCase()
  );
  if (exists) {
    return { ok: false, reason: "duplicate" };
  }

  const next = [...current, trimmed];
  writeCustomCategories(userId, next);
  return { ok: true, categories: next };
}

export function getAllCategories(userId) {
  const set = new Set([...DEFAULT_CATEGORIES, ...readCustomCategories(userId)]);
  return [...set];
}
