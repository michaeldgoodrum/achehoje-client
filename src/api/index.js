// API layer — swap placeholder data for real HTTP calls when backend is ready
// All functions return Promises so components don't need to change when we go live

import {
  propertiesForSale,
  propertiesForRent,
  agents,
} from "../data/properties";

const BASE_URL = import.meta.env.VITE_API_URL || "";

// ── Simulates network delay during development ──────────────────────────────
const fakeDelay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

// ── Properties ───────────────────────────────────────────────────────────────

export const fetchPropertiesForSale = async (filters = {}) => {
  if (BASE_URL) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${BASE_URL}/api/properties/sale?${params}`);
    if (!res.ok) throw new Error("Erro ao buscar imóveis à venda");
    return res.json();
  }

  // Placeholder: filter in-memory
  await fakeDelay();
  let results = [...propertiesForSale];

  if (filters.city) {
    results = results.filter((p) =>
      p.city.toLowerCase().includes(filters.city.toLowerCase())
    );
  }
  if (filters.minPrice) {
    results = results.filter((p) => p.price >= Number(filters.minPrice));
  }
  if (filters.maxPrice) {
    results = results.filter((p) => p.price <= Number(filters.maxPrice));
  }
  if (filters.bedrooms) {
    results = results.filter((p) => p.bedrooms >= Number(filters.bedrooms));
  }
  if (filters.type) {
    results = results.filter((p) =>
      p.type.toLowerCase() === filters.type.toLowerCase()
    );
  }

  return results;
};

export const fetchPropertiesForRent = async (filters = {}) => {
  if (BASE_URL) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${BASE_URL}/api/properties/rent?${params}`);
    if (!res.ok) throw new Error("Erro ao buscar imóveis para alugar");
    return res.json();
  }

  await fakeDelay();
  let results = [...propertiesForRent];

  if (filters.city) {
    results = results.filter((p) =>
      p.city.toLowerCase().includes(filters.city.toLowerCase())
    );
  }
  if (filters.minPrice) {
    results = results.filter((p) => p.price >= Number(filters.minPrice));
  }
  if (filters.maxPrice) {
    results = results.filter((p) => p.price <= Number(filters.maxPrice));
  }
  if (filters.bedrooms) {
    results = results.filter((p) => p.bedrooms >= Number(filters.bedrooms));
  }
  if (filters.type) {
    results = results.filter((p) =>
      p.type.toLowerCase() === filters.type.toLowerCase()
    );
  }

  return results;
};

export const fetchPropertyById = async (id, listingType = "sale") => {
  if (BASE_URL) {
    const res = await fetch(`${BASE_URL}/api/properties/${id}?type=${listingType}`);
    if (!res.ok) throw new Error("Imóvel não encontrado");
    return res.json();
  }

  await fakeDelay();
  const list =
    listingType === "rent" ? propertiesForRent : propertiesForSale;
  return list.find((p) => p.id === Number(id)) || null;
};

// ── Agents ───────────────────────────────────────────────────────────────────

export const fetchAgents = async (filters = {}) => {
  if (BASE_URL) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${BASE_URL}/api/agents?${params}`);
    if (!res.ok) throw new Error("Erro ao buscar corretores");
    return res.json();
  }

  await fakeDelay();
  let results = [...agents];

  if (filters.city) {
    results = results.filter((a) =>
      a.city.toLowerCase().includes(filters.city.toLowerCase())
    );
  }
  if (filters.state) {
    results = results.filter((a) =>
      a.state.toLowerCase() === filters.state.toLowerCase()
    );
  }

  return results;
};

export const fetchAgentById = async (id) => {
  if (BASE_URL) {
    const res = await fetch(`${BASE_URL}/api/agents/${id}`);
    if (!res.ok) throw new Error("Corretor não encontrado");
    return res.json();
  }

  await fakeDelay();
  return agents.find((a) => a.id === Number(id)) || null;
};
