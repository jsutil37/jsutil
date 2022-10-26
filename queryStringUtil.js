export const setCurrentQueryParam = (key: string, value: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState({}, '', url.toString());
};

export const deleteCurrentQueryParam = (key: string) => {
  const url = new URL(window.location.href);
  url.searchParams.delete(key);
  window.history.pushState({}, '', url.toString());
};

export const getCurrentQueryParam = (key: string) => {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
};