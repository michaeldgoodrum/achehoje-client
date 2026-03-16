import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchPropertyById } from "../api";
import { formatCurrency, formatArea, formatDaysListed } from "../utils/format";
import "./PropertyDetail.css";

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const STATS = [
  {
    key: "bedrooms",
    label: (v) => `${v} ${v === 1 ? "quarto" : "quartos"}`,
    icon: (
      <svg viewBox="0 0 24 24"><path d="M20 9.5V7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6.5h2V19h2v-2h8v2h2v-5.5h2v-2h-2V9.5h4zM13 9.5H7V7h6v2.5z"/></svg>
    ),
  },
  {
    key: "bathrooms",
    label: (v) => `${v} ${v === 1 ? "banheiro" : "banheiros"}`,
    icon: (
      <svg viewBox="0 0 24 24"><path d="M7 11h10v2H7zm-3 3h16v2H4zm2 4h12v2H6zm-3-9.5C3 7.6 4.6 6 6.5 6H11V4H6.5C3.5 4 1 6.5 1 9.5V11h2V8.5z"/></svg>
    ),
  },
  {
    key: "area",
    label: (v) => formatArea(v),
    icon: (
      <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
    ),
  },
  {
    key: "parkingSpots",
    label: (v) => `${v} ${v === 1 ? "vaga" : "vagas"}`,
    icon: (
      <svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
    ),
  },
];

export default function PropertyDetail() {
  const { listingType, id } = useParams();
  const navigate = useNavigate();
  const apiType = listingType === "aluguel" ? "rent" : "sale";

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPropertyById(id, apiType).then((data) => {
      if (!data) setNotFound(true);
      else setProperty(data);
      setLoading(false);
    });
  }, [id, apiType]);

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="detail-loading__spinner" />
        <p>Carregando imóvel...</p>
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="detail-notfound">
        <h2>Imóvel não encontrado</h2>
        <p>Este imóvel pode ter sido removido ou o link está incorreto.</p>
        <Link to={apiType === "rent" ? "/alugar" : "/comprar"}>
          Voltar aos imóveis
        </Link>
      </div>
    );
  }

  const backHref = apiType === "rent" ? "/alugar" : "/comprar";
  const backLabel = apiType === "rent" ? "Alugar" : "Comprar";

  return (
    <div className="detail">
      {/* Breadcrumb */}
      <div className="detail__breadcrumb">
        <Link to="/">Início</Link>
        <span>/</span>
        <Link to={backHref}>{backLabel}</Link>
        <span>/</span>
        <span>{property.title}</span>
      </div>

      <div className="detail__layout">
        {/* ── Left / main ── */}
        <div className="detail__main">
          {/* Hero image */}
          <div className="detail__image-wrap">
            <img src={property.image} alt={property.title} className="detail__image" />
            {property.isFeatured && (
              <span className="detail__badge detail__badge--featured">Destaque</span>
            )}
            <span className="detail__badge detail__badge--type">{property.type}</span>
            <span className="detail__listed">{formatDaysListed(property.listedDays)}</span>
          </div>

          {/* Title block */}
          <div className="detail__header">
            <div>
              <h1 className="detail__title">{property.title}</h1>
              <p className="detail__address">
                {property.address} · {property.neighborhood}, {property.city} – {property.state}
              </p>
            </div>
            <div className="detail__price-block">
              <p className="detail__price">
                {formatCurrency(property.price)}
                {apiType === "rent" && <span className="detail__price-suffix">/mês</span>}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="detail__stats">
            {STATS.map(({ key, label, icon }) => {
              const val = property[key];
              if (val === null || val === undefined || val === 0) return null;
              return (
                <div key={key} className="detail__stat">
                  {icon}
                  <span>{label(val)}</span>
                </div>
              );
            })}
          </div>

          {/* Features */}
          {property.features?.length > 0 && (
            <div className="detail__section">
              <h2 className="detail__section-title">Características</h2>
              <ul className="detail__features">
                {property.features.map((f) => (
                  <li key={f} className="detail__feature-tag">{f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Map */}
          {property.lat && property.lng && (
            <div className="detail__section">
              <h2 className="detail__section-title">Localização</h2>
              <p className="detail__location-label">
                {property.neighborhood}, {property.city} – {property.state}
              </p>
              <div className="detail__map">
                <MapContainer
                  center={[property.lat, property.lng]}
                  zoom={15}
                  style={{ width: "100%", height: "100%" }}
                  scrollWheelZoom={false}
                  zoomControl
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[property.lat, property.lng]} />
                </MapContainer>
              </div>
            </div>
          )}
        </div>

        {/* ── Right / contact sidebar ── */}
        <aside className="detail__sidebar">
          <div className="detail__contact-card">
            <p className="detail__contact-price">
              {formatCurrency(property.price)}
              {apiType === "rent" && <span className="detail__price-suffix">/mês</span>}
            </p>
            <p className="detail__contact-address">
              {property.neighborhood}, {property.city}
            </p>

            <div className="detail__contact-divider" />

            <h3 className="detail__contact-title">Entre em contato</h3>
            <form className="detail__contact-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Seu nome"
                className="detail__contact-input"
                required
              />
              <input
                type="email"
                placeholder="Seu e-mail"
                className="detail__contact-input"
                required
              />
              <input
                type="tel"
                placeholder="Seu telefone"
                className="detail__contact-input"
              />
              <textarea
                className="detail__contact-input detail__contact-textarea"
                placeholder={`Olá, tenho interesse neste imóvel em ${property.city}. Poderia me dar mais informações?`}
                rows={4}
              />
              <button type="submit" className="detail__contact-btn">
                Enviar mensagem
              </button>
            </form>

            <a href="tel:+5511999999999" className="detail__contact-phone">
              <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              Ligar para o anunciante
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
