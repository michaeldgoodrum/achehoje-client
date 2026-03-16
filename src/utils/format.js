// Utility functions for Brazilian market formatting
// These helpers centralize formatting logic for easy backend integration

// Strip diacritics and lowercase for accent-insensitive comparison
const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

// Fuzzy city match: handles "São Paulo, SP", "sao paulo", "Rio", typos, etc.
// Splits query into tokens and checks all appear in "city state" target.
export const fuzzyMatchCity = (query, city, state) => {
  const target = normalize(`${city} ${state}`);
  const tokens = normalize(query).split(/[\s,]+/).filter(Boolean);
  return tokens.every((token) => target.includes(token));
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatArea = (sqm) => {
  return `${sqm} m²`;
};

export const formatDaysListed = (days) => {
  if (days === 0) return "Anunciado hoje";
  if (days === 1) return "Anunciado ontem";
  return `Anunciado há ${days} dias`;
};

export const formatRating = (rating) => {
  return rating.toFixed(1).replace(".", ",");
};
