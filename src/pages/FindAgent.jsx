import { useState, useEffect } from "react";
import AgentCard from "../components/AgentCard";
import { fetchAgents } from "../api";
import "./FindAgent.css";

const BRAZIL_STATES = [
  "", "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export default function FindAgent() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: "", state: "" });
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchAgents(filters).then((data) => {
      if (active) {
        setAgents(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, city: searchInput }));
  };

  return (
    <div className="find-agent">
      {/* Hero */}
      <div className="find-agent__hero">
        <div className="find-agent__hero-inner">
          <h1 className="find-agent__title">Encontre o Corretor Ideal</h1>
          <p className="find-agent__subtitle">
            Corretores verificados, credenciados e com excelente avaliação de clientes reais
          </p>

          <form className="find-agent__search" onSubmit={handleSearch}>
            <div className="find-agent__search-row">
              <div className="find-agent__input-wrap">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                <input
                  type="text"
                  placeholder="Buscar por cidade..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="find-agent__input"
                />
              </div>

              <select
                className="find-agent__state-select"
                value={filters.state}
                onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))}
              >
                <option value="">Todos os estados</option>
                {BRAZIL_STATES.filter(Boolean).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <button type="submit" className="find-agent__search-btn">
                Buscar Corretor
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Trust badges */}
      <div className="find-agent__trust">
        <div className="find-agent__trust-inner">
          <div className="find-agent__trust-item">
            <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
            <span>Todos com CRECI ativo</span>
          </div>
          <div className="find-agent__trust-item">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <span>Identidade verificada</span>
          </div>
          <div className="find-agent__trust-item">
            <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            <span>Avaliações reais de clientes</span>
          </div>
          <div className="find-agent__trust-item">
            <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            <span>Contato direto e gratuito</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="find-agent__content">
        <div className="find-agent__inner">
          {loading ? (
            <div className="find-agent__loading">
              <div className="find-agent__spinner" />
              <p>Buscando os melhores corretores...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="find-agent__empty">
              <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              <h2>Nenhum corretor encontrado</h2>
              <p>Tente buscar em outra cidade ou estado.</p>
              <button
                onClick={() => { setFilters({ city: "", state: "" }); setSearchInput(""); }}
                className="find-agent__reset-btn"
              >
                Ver todos os corretores
              </button>
            </div>
          ) : (
            <>
              <div className="find-agent__results-header">
                <p className="find-agent__count">
                  <strong>{agents.length}</strong> corretores encontrados
                  {filters.city && ` em ${filters.city}`}
                  {filters.state && ` (${filters.state})`}
                </p>
              </div>
              <div className="find-agent__grid">
                {agents.map((a) => (
                  <AgentCard key={a.id} agent={a} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="find-agent__how-section">
        <div className="find-agent__inner">
          <h2 className="find-agent__how-title">Como funciona?</h2>
          <div className="find-agent__how-grid">
            <div className="find-agent__how-step">
              <div className="find-agent__how-num">1</div>
              <h3>Busque um corretor</h3>
              <p>Filtre por cidade, estado e especialidade para encontrar o profissional ideal para você.</p>
            </div>
            <div className="find-agent__how-step">
              <div className="find-agent__how-num">2</div>
              <h3>Entre em contato</h3>
              <p>Ligue ou envie uma mensagem diretamente pelo Ache Hoje. É grátis e sem intermediários.</p>
            </div>
            <div className="find-agent__how-step">
              <div className="find-agent__how-num">3</div>
              <h3>Visite os imóveis</h3>
              <p>O corretor irá apresentar as opções que melhor atendem ao seu perfil e orçamento.</p>
            </div>
            <div className="find-agent__how-step">
              <div className="find-agent__how-num">4</div>
              <h3>Feche o negócio</h3>
              <p>Com o corretor certo, a negociação e toda a documentação ficam muito mais simples.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
