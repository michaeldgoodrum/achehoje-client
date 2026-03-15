import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { brazilianCities } from "../data/properties";
import "./SearchBar.css";

export default function SearchBar({ defaultTab = "comprar", compact = false }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleLocationChange = (e) => {
    const val = e.target.value;
    setLocation(val);
    if (val.length > 1) {
      setSuggestions(
        brazilianCities
          .filter((c) => c.toLowerCase().includes(val.toLowerCase()))
          .slice(0, 6)
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const path = activeTab === "comprar" ? "/comprar" : "/alugar";
    const query = location ? `?cidade=${encodeURIComponent(location)}` : "";
    navigate(`${path}${query}`);
    setSuggestions([]);
  };

  const pickSuggestion = (city) => {
    setLocation(city);
    setSuggestions([]);
  };

  return (
    <div className={`searchbar ${compact ? "searchbar--compact" : ""}`}>
      {!compact && (
        <div className="searchbar__tabs">
          <button
            className={`searchbar__tab ${activeTab === "comprar" ? "searchbar__tab--active" : ""}`}
            onClick={() => setActiveTab("comprar")}
            type="button"
          >
            Comprar
          </button>
          <button
            className={`searchbar__tab ${activeTab === "alugar" ? "searchbar__tab--active" : ""}`}
            onClick={() => setActiveTab("alugar")}
            type="button"
          >
            Alugar
          </button>
        </div>
      )}

      <form className="searchbar__form" onSubmit={handleSearch}>
        <div className="searchbar__input-wrap">
          <svg className="searchbar__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por cidade, bairro ou CEP..."
            value={location}
            onChange={handleLocationChange}
            className="searchbar__input"
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="searchbar__suggestions">
              {suggestions.map((city) => (
                <li key={city} onClick={() => pickSuggestion(city)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="searchbar__btn">
          Buscar Imóveis
        </button>
      </form>
    </div>
  );
}
