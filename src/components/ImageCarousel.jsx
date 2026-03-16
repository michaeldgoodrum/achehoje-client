import { useState } from "react";
import "./ImageCarousel.css";

export default function ImageCarousel({ images, alt = "", compact = false }) {
  const [current, setCurrent] = useState(0);

  if (!images?.length) return null;

  const prev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };

  const next = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  };

  const goTo = (e, i) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent(i);
  };

  return (
    <div className={`carousel${compact ? " carousel--compact" : ""}`}>
      {/* Sliding track */}
      <div
        className="carousel__track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${alt} — foto ${i + 1}`}
            className="carousel__img"
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            className="carousel__btn carousel__btn--prev"
            onClick={prev}
            aria-label="Foto anterior"
          >
            <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>
          </button>
          <button
            className="carousel__btn carousel__btn--next"
            onClick={next}
            aria-label="Próxima foto"
          >
            <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
          </button>

          <span className="carousel__counter">{current + 1} / {images.length}</span>

          <div className="carousel__dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`carousel__dot${i === current ? " carousel__dot--active" : ""}`}
                onClick={(e) => goTo(e, i)}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>

          {/* Thumbnail strip — only in full mode */}
          {!compact && (
            <div className="carousel__thumbs">
              {images.map((src, i) => (
                <button
                  key={i}
                  className={`carousel__thumb${i === current ? " carousel__thumb--active" : ""}`}
                  onClick={(e) => goTo(e, i)}
                  aria-label={`Ver foto ${i + 1}`}
                >
                  <img src={src} alt={`${alt} miniatura ${i + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
