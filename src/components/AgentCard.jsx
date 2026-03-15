import { formatRating } from "../utils/format";
import "./AgentCard.css";

export default function AgentCard({ agent }) {
  const {
    name,
    photo,
    creci,
    specialty,
    city,
    state,
    rating,
    reviewCount,
    activeListings,
    soldLastYear,
    languages,
    phone,
    agency,
    yearsExperience,
  } = agent;

  return (
    <div className="agent-card">
      <div className="agent-card__header">
        <img src={photo} alt={name} className="agent-card__photo" loading="lazy" />
        <div className="agent-card__info">
          <h3 className="agent-card__name">{name}</h3>
          <p className="agent-card__agency">{agency}</p>
          <p className="agent-card__creci">{creci}</p>
          <div className="agent-card__rating">
            <span className="agent-card__stars">
              {"★".repeat(Math.round(rating))}
              {"☆".repeat(5 - Math.round(rating))}
            </span>
            <span className="agent-card__rating-val">{formatRating(rating)}</span>
            <span className="agent-card__review-count">({reviewCount} avaliações)</span>
          </div>
        </div>
      </div>

      <div className="agent-card__stats">
        <div className="agent-card__stat">
          <span className="agent-card__stat-value">{activeListings}</span>
          <span className="agent-card__stat-label">Anúncios ativos</span>
        </div>
        <div className="agent-card__stat">
          <span className="agent-card__stat-value">{soldLastYear}</span>
          <span className="agent-card__stat-label">Vendas no ano</span>
        </div>
        <div className="agent-card__stat">
          <span className="agent-card__stat-value">{yearsExperience}</span>
          <span className="agent-card__stat-label">Anos de exp.</span>
        </div>
      </div>

      <div className="agent-card__body">
        <p className="agent-card__specialty">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
          {specialty}
        </p>
        <p className="agent-card__location">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          {city}, {state}
        </p>
        <p className="agent-card__languages">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
          {languages.join(" · ")}
        </p>
      </div>

      <div className="agent-card__actions">
        <a href={`tel:${phone}`} className="agent-card__btn agent-card__btn--call">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          Ligar
        </a>
        <button className="agent-card__btn agent-card__btn--message">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          Mensagem
        </button>
      </div>
    </div>
  );
}
