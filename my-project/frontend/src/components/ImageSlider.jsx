import { useEffect, useState } from "react";

const DEFAULT_SLIDES = [
  "/module3/slides/slide-1.jpeg",
  "/module3/slides/slide-2.jpeg",
  "/module3/slides/slide-3.jpeg",
  "/module3/slides/slide-4.jpeg",
];

export default function ImageSlider({ title = "Фотогалерея", slides = DEFAULT_SLIDES }) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goPrev = () => setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setSlideIndex((prev) => (prev + 1) % slides.length);

  return (
    <div className="card mb-8 !p-0 overflow-hidden animate-in">
      {title && <h3 className="px-4 pt-4">{title}</h3>}
      <div className="slider">
        <img
          key={slideIndex}
          src={slides[slideIndex]}
          alt={`Слайд ${slideIndex + 1}`}
          className="slider-img slider-fade"
          loading="lazy"
        />
        <div className="slider-controls">
          <button type="button" className="slider-btn" onClick={goPrev} aria-label="Предыдущий слайд">
            ‹
          </button>
          <button type="button" className="slider-btn" onClick={goNext} aria-label="Следующий слайд">
            ›
          </button>
        </div>
      </div>
      <div className="slider-dots">
        {slides.map((src, index) => (
          <button
            key={src}
            type="button"
            className={index === slideIndex ? "dot active" : "dot"}
            onClick={() => setSlideIndex(index)}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
