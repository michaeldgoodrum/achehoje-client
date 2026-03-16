import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatCurrency } from "../utils/format";
import "./PropertyMap.css";

// Fix default marker icon paths broken by bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createPriceIcon(price, isActive) {
  const label = formatCurrency(price)
    .replace("R$\u00a0", "R$ ")
    .replace(/\.000$/, "k")
    .replace(/\.(\d{3})\.(\d{3})$/, ".$1M")
    .replace(/\.(\d{3})$/, "k");

  return L.divIcon({
    className: "",
    html: `<div class="map-pin${isActive ? " map-pin--active" : ""}">
      <span>${label}</span>
    </div>`,
    iconAnchor: [0, 0],
  });
}

function FitBounds({ properties }) {
  const map = useMap();
  const prevCount = useRef(0);

  useEffect(() => {
    if (!properties.length) return;
    if (properties.length === prevCount.current) return;
    prevCount.current = properties.length;

    const coords = properties
      .filter((p) => p.lat && p.lng)
      .map((p) => [p.lat, p.lng]);
    if (coords.length) {
      map.fitBounds(coords, { padding: [40, 40], maxZoom: 12 });
    }
  }, [properties, map]);

  return null;
}

export default function PropertyMap({ properties, activeId, onPinClick }) {
  const withCoords = properties.filter((p) => p.lat && p.lng);

  return (
    <div className="property-map">
      <MapContainer
        center={[-15.7801, -47.9292]}
        zoom={4}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds properties={withCoords} />
        {withCoords.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={createPriceIcon(p.price, p.id === activeId)}
            eventHandlers={{ click: () => onPinClick?.(p.id) }}
          >
            <Popup>
              <div className="map-popup">
                <img src={p.images?.[0]} alt={p.title} />
                <strong>{p.title}</strong>
                <span>{formatCurrency(p.price)}</span>
                <small>{p.neighborhood}, {p.city}</small>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
