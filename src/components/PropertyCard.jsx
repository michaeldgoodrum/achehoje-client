import { formatCurrency, formatArea, formatDaysListed } from "../utils/format";
import "./PropertyCard.css";

export default function PropertyCard({ property, listingType = "sale" }) {
  const {
    type,
    title,
    price,
    address,
    neighborhood,
    city,
    state,
    bedrooms,
    bathrooms,
    area,
    parkingSpots,
    image,
    isFeatured,
    listedDays,
  } = property;

  return (
    <div className="property-card">
      <div className="property-card__image-wrap">
        <img
          src={image}
          alt={title}
          className="property-card__image"
          loading="lazy"
        />
        {isFeatured && (
          <span className="property-card__badge property-card__badge--featured">
            Destaque
          </span>
        )}
        <span className="property-card__badge property-card__badge--type">
          {type}
        </span>
        <span className="property-card__listed">{formatDaysListed(listedDays)}</span>
      </div>

      <div className="property-card__body">
        <p className="property-card__price">
          {formatCurrency(price)}
          {listingType === "rent" && (
            <span className="property-card__price-suffix">/mês</span>
          )}
        </p>
        <h3 className="property-card__title">{title}</h3>
        <p className="property-card__address">
          {neighborhood} · {city}, {state}
        </p>

        <div className="property-card__features">
          {bedrooms !== null && bedrooms !== undefined && (
            <span className="property-card__feature">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 9.5V7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6.5h2V19h2v-2h8v2h2v-5.5h2v-2h-2V9.5h4zM13 9.5H7V7h6v2.5z"/></svg>
              {bedrooms} {bedrooms === 1 ? "quarto" : "quartos"}
            </span>
          )}
          {bathrooms !== null && bathrooms !== undefined && (
            <span className="property-card__feature">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11h10v2H7zm-3 3h16v2H4zm2 4h12v2H6zm-3-9.5C3 7.6 4.6 6 6.5 6H11V4H6.5C3.5 4 1 6.5 1 9.5V11h2V8.5z"/></svg>
              {bathrooms} {bathrooms === 1 ? "banheiro" : "banheiros"}
            </span>
          )}
          <span className="property-card__feature">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            {formatArea(area)}
          </span>
          {parkingSpots !== null && parkingSpots !== undefined && parkingSpots > 0 && (
            <span className="property-card__feature">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
              {parkingSpots} {parkingSpots === 1 ? "vaga" : "vagas"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
