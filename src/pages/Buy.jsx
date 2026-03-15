import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import FilterBar from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import { fetchPropertiesForSale } from "../api";
import "./Listings.css";

export default function Buy() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: searchParams.get("cidade") || "",
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPropertiesForSale(filters).then((data) => {
      if (active) {
        setProperties(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [filters]);

  // When URL param changes, update city filter
  useEffect(() => {
    const cidade = searchParams.get("cidade");
    if (cidade) setFilters((f) => ({ ...f, city: cidade }));
  }, [searchParams]);

  return (
    <div className="listings-page">
      {/* Search header */}
      <div className="listings-page__hero">
        <div className="listings-page__hero-inner">
          <h1 className="listings-page__title">Imóveis à Venda</h1>
          <p className="listings-page__subtitle">
            {loading ? "Buscando imóveis..." : `${properties.length} imóveis encontrados`}
            {filters.city && ` em ${filters.city}`}
          </p>
          <SearchBar defaultTab="comprar" compact />
        </div>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="listings-page__content">
        <div className="listings-page__inner">
          {loading ? (
            <div className="listings-page__loading">
              <div className="listings-page__spinner" />
              <p>Buscando os melhores imóveis para você...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="listings-page__empty">
              <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              <h2>Nenhum imóvel encontrado</h2>
              <p>Tente ajustar os filtros ou buscar em outra cidade.</p>
              <button onClick={() => setFilters({})} className="listings-page__reset-btn">
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="listings-page__results-header">
                <p className="listings-page__count">
                  <strong>{properties.length}</strong> imóveis encontrados
                  {filters.city && ` em ${filters.city}`}
                </p>
                <select className="listings-page__sort">
                  <option>Mais relevantes</option>
                  <option>Menor preço</option>
                  <option>Maior preço</option>
                  <option>Mais recentes</option>
                </select>
              </div>
              <div className="listings-page__grid">
                {properties.map((p) => (
                  <PropertyCard key={p.id} property={p} listingType="sale" />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
