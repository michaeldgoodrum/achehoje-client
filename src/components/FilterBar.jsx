import "./FilterBar.css";

const PROPERTY_TYPES = ["Todos", "Apartamento", "Casa", "Kitnet", "Terreno", "Comercial"];
const BEDROOMS = ["Qualquer", "1+", "2+", "3+", "4+"];

export default function FilterBar({ filters, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="filterbar">
      <div className="filterbar__inner">
        {/* Property type */}
        <div className="filterbar__group">
          <label className="filterbar__label">Tipo</label>
          <select
            className="filterbar__select"
            value={filters.type || "Todos"}
            onChange={(e) =>
              handleChange("type", e.target.value === "Todos" ? "" : e.target.value)
            }
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Price range */}
        <div className="filterbar__group">
          <label className="filterbar__label">Preço mínimo (R$)</label>
          <select
            className="filterbar__select"
            value={filters.minPrice || ""}
            onChange={(e) => handleChange("minPrice", e.target.value)}
          >
            <option value="">Sem mínimo</option>
            <option value="100000">R$ 100.000</option>
            <option value="250000">R$ 250.000</option>
            <option value="500000">R$ 500.000</option>
            <option value="1000000">R$ 1.000.000</option>
            <option value="2000000">R$ 2.000.000</option>
          </select>
        </div>

        <div className="filterbar__group">
          <label className="filterbar__label">Preço máximo (R$)</label>
          <select
            className="filterbar__select"
            value={filters.maxPrice || ""}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
          >
            <option value="">Sem máximo</option>
            <option value="250000">R$ 250.000</option>
            <option value="500000">R$ 500.000</option>
            <option value="1000000">R$ 1.000.000</option>
            <option value="2000000">R$ 2.000.000</option>
            <option value="5000000">R$ 5.000.000</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div className="filterbar__group">
          <label className="filterbar__label">Quartos</label>
          <div className="filterbar__pills">
            {BEDROOMS.map((b) => {
              const val = b === "Qualquer" ? "" : b.replace("+", "");
              return (
                <button
                  key={b}
                  className={`filterbar__pill ${
                    (filters.bedrooms || "") === val ? "filterbar__pill--active" : ""
                  }`}
                  onClick={() => handleChange("bedrooms", val)}
                  type="button"
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clear */}
        <button
          className="filterbar__clear"
          onClick={() => onChange({})}
          type="button"
        >
          Limpar filtros
        </button>
      </div>
    </div>
  );
}
