export const getFromSessionStorage = (key) => {
  if (typeof window === "undefined") return;
  return JSON.parse(sessionStorage.getItem(key));
};

export const setToSessionStorage = (key, value) => {
  if (typeof window === "undefined") return;
  return sessionStorage.setItem(key, JSON.stringify(value));
};

export const removeFromSessionStorage = (key) => {
  if (typeof window === "undefined") return;
  return sessionStorage.removeItem(key);
};
