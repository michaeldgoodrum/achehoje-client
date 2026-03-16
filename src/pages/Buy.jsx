import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import FilterBar from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import PropertyMap from "../components/PropertyMap";
import { fetchPropertiesForSale } from "../api";
import "./Listings.css";

export default function Buy() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
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
          <div className="listings-page__hero-text">
            <h1 className="listings-page__title">Imóveis à Venda</h1>
            <p className="listings-page__subtitle">
              {loading ? "Buscando imóveis..." : `${properties.length} imóveis disponíveis`}
              {filters.city && ` em ${filters.city}`}
            </p>
          </div>
          <SearchBar defaultTab="comprar" compact />
        </div>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="listings-page__split">
        {/* Left: map */}
        <div className="listings-page__map-col">
          <PropertyMap
            properties={properties}
            activeId={activeId}
            onPinClick={setActiveId}
          />
        </div>

        {/* Right: cards */}
        <div className="listings-page__cards-col">
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
                  <strong>{properties.length}</strong> imóveis disponíveis
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
                  <PropertyCard
                    key={p.id}
                    property={p}
                    listingType="sale"
                    highlighted={p.id === activeId}
                    onMouseEnter={() => setActiveId(p.id)}
                    onMouseLeave={() => setActiveId(null)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
