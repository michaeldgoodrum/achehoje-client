// Utility functions for Brazilian market formatting
// These helpers centralize formatting logic for easy backend integration

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
