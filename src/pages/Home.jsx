import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";
import { propertiesForSale, propertiesForRent } from "../data/properties";
import { formatCurrency } from "../utils/format";
import "./Home.css";

const HERO_STATS = [
  { value: "38.000+", label: "Imóveis anunciados" },
  { value: "1.200+", label: "Corretores parceiros" },
  { value: "26", label: "Estados cobertos" },
  { value: "4,9★", label: "Avaliação média" },
];

const FEATURED_CITIES = [
  {
    name: "São Paulo",
    state: "SP",
    image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=600&q=80",
    listings: 12400,
  },
  {
    name: "Rio de Janeiro",
    state: "RJ",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=80",
    listings: 8200,
  },
  {
    name: "Florianópolis",
    state: "SC",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80",
    listings: 3100,
  },
  {
    name: "Salvador",
    state: "BA",
    image: "https://images.unsplash.com/photo-1568454537842-d933259bb258?w=600&q=80",
    listings: 4800,
  },
  {
    name: "Fortaleza",
    state: "CE",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    listings: 2900,
  },
  {
    name: "Balneário Camboriú",
    state: "SC",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    listings: 1600,
  },
];

const WHY_ITEMS = [
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
    ),
    title: "Anúncios verificados",
    desc: "Todos os imóveis são validados por nossa equipe antes de ir ao ar.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
    ),
    title: "Corretores credenciados",
    desc: "Trabalhamos apenas com corretores com CRECI ativo e avaliados pela comunidade.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
    ),
    title: "Atualizações em tempo real",
    desc: "Novos imóveis adicionados diariamente. Seja o primeiro a saber.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
    ),
    title: "Compra segura",
    desc: "Documentação orientada passo a passo, do primeiro contato à escritura.",
  },
];

export default function Home() {
  const heroRef = useRef(null);

  // Parallax effect on hero
  useEffect(() => {
    const handler = () => {
      if (heroRef.current) {
        const scroll = window.scrollY;
        heroRef.current.style.backgroundPositionY = `calc(50% + ${scroll * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const featuredSale = propertiesForSale.filter((p) => p.isFeatured).slice(0, 3);
  const featuredRent = propertiesForRent.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <div className="home">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="home__hero" ref={heroRef}>
        <div className="home__hero-overlay" />
        <div className="home__hero-content">
          <p className="home__hero-eyebrow">O imóvel dos seus sonhos está aqui</p>
          <h1 className="home__hero-heading">
            Ache seu lar<br />
            <span className="home__hero-heading--accent">hoje mesmo.</span>
          </h1>
          <p className="home__hero-sub">
            Milhares de imóveis em todo o Brasil — compra, aluguel e os melhores corretores do mercado.
          </p>
          <SearchBar />
        </div>

        <div className="home__hero-stats">
          {HERO_STATS.map((s) => (
            <div key={s.label} className="home__hero-stat">
              <span className="home__hero-stat-value">{s.value}</span>
              <span className="home__hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured for sale ────────────────────────── */}
      <section className="home__section">
        <div className="home__section-inner">
          <div className="home__section-header">
            <div>
              <h2 className="home__section-title">Imóveis em destaque para compra</h2>
              <p className="home__section-sub">Seleção especial de imóveis verificados</p>
            </div>
            <Link to="/comprar" className="home__section-link">
              Ver todos →
            </Link>
          </div>
          <div className="home__grid">
            {featuredSale.map((p) => (
              <PropertyCard key={p.id} property={p} listingType="sale" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Cities ───────────────────────────────────── */}
      <section className="home__cities-section">
        <div className="home__section-inner">
          <h2 className="home__section-title">Explore as principais cidades</h2>
          <p className="home__section-sub">De metrópoles a destinos de praia — encontre onde você quer morar</p>
          <div className="home__cities-grid">
            {FEATURED_CITIES.map((city) => (
              <Link
                key={city.name}
                to={`/comprar?cidade=${encodeURIComponent(city.name)}`}
                className="home__city-card"
              >
                <img src={city.image} alt={city.name} loading="lazy" />
                <div className="home__city-overlay">
                  <h3 className="home__city-name">{city.name}, {city.state}</h3>
                  <p className="home__city-count">{city.listings.toLocaleString("pt-BR")} imóveis</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured for rent ────────────────────────── */}
      <section className="home__section home__section--alt">
        <div className="home__section-inner">
          <div className="home__section-header">
            <div>
              <h2 className="home__section-title">Imóveis para alugar</h2>
              <p className="home__section-sub">Opções para todos os perfis e bolsos</p>
            </div>
            <Link to="/alugar" className="home__section-link">
              Ver todos →
            </Link>
          </div>
          <div className="home__grid">
            {featuredRent.map((p) => (
              <PropertyCard key={p.id} property={p} listingType="rent" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Ache Hoje ─────────────────────────────── */}
      <section className="home__why-section">
        <div className="home__section-inner">
          <h2 className="home__section-title home__section-title--center">
            Por que escolher o Ache Hoje?
          </h2>
          <div className="home__why-grid">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="home__why-card">
                <div className="home__why-icon">{item.icon}</div>
                <h3 className="home__why-title">{item.title}</h3>
                <p className="home__why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────── */}
      <section className="home__cta-section">
        <div className="home__section-inner">
          <div className="home__cta-card">
            <div className="home__cta-text">
              <h2>Quer anunciar seu imóvel?</h2>
              <p>Cadastre seu imóvel e alcance milhares de compradores e inquilinos em todo o Brasil.</p>
            </div>
            <div className="home__cta-actions">
              <Link to="/corretores" className="home__cta-btn home__cta-btn--primary">
                Encontrar um Corretor
              </Link>
              <Link to="/comprar" className="home__cta-btn home__cta-btn--secondary">
                Buscar Imóveis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="home__footer">
        <div className="home__section-inner">
          <div className="home__footer-grid">
            <div>
              <div className="home__footer-logo">
                <span className="logo-green">ache</span>
                <span className="logo-yellow">hoje</span>
                <span className="logo-green">.</span>
              </div>
              <p className="home__footer-tagline">
                O maior portal de imóveis do Brasil.<br />
                Ache hoje, mude amanhã.
              </p>
            </div>
            <div>
              <h4>Imóveis</h4>
              <ul>
                <li><Link to="/comprar">Comprar</Link></li>
                <li><Link to="/alugar">Alugar</Link></li>
                <li><Link to="/corretores">Corretores</Link></li>
              </ul>
            </div>
            <div>
              <h4>Ajuda</h4>
              <ul>
                <li><a href="#">Como funciona</a></li>
                <li><a href="#">Dúvidas frequentes</a></li>
                <li><a href="#">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4>Sobre</h4>
              <ul>
                <li><a href="#">Quem somos</a></li>
                <li><a href="#">Trabalhe conosco</a></li>
                <li><a href="#">Imprensa</a></li>
              </ul>
            </div>
          </div>
          <div className="home__footer-bottom">
            <p>© 2025 Ache Hoje. Todos os direitos reservados.</p>
            <p>
              <a href="#">Política de Privacidade</a> ·{" "}
              <a href="#">Termos de Uso</a> ·{" "}
              <a href="#">LGPD</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
