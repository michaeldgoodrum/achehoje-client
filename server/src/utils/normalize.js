// Accent-insensitive normalization — mirrors the client's utils/format.js so
// server-side city matching behaves identically to the placeholder filtering.

// Strip diacritics and lowercase for accent-insensitive comparison.
export const normalize = (str = "") =>
  str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

// Escape a string so it can be used literally inside a RegExp.
export const escapeRegex = (str = "") =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
