import { useEffect, useState } from "react";
import { fetchMyBookings } from "../api/bookingsApi";
import { createReview, fetchMyReviews } from "../api/reviewsApi";

function statusClass(status) {
  if (status === "Новая") return "status-new";
  if (status === "Банкет назначен") return "status-assigned";
  return "status-done";
}

function formatDate(value) {
  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CabinetPage({ user }) {
  const slides = [
    "/module2/slide-1.jpeg",
    "/module2/slide-2.jpeg",
    "/module2/slide-3.jpeg",
    "/module2/slide-4.jpeg",
  ];
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reviewForm, setReviewForm] = useState({ bookingId: "", text: "", rating: 5 });
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const [bRes, rRes] = await Promise.all([fetchMyBookings(), fetchMyReviews()]);
      setBookings(bRes.data);
      setReviews(rRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const reviewedIds = new Set(reviews.map((r) => String(r.booking?._id || r.booking)));
  const canReview = bookings.filter(
    (b) => b.status === "Банкет завершен" && !reviewedIds.has(String(b._id))
  );

  const submitReview = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await createReview(reviewForm);
      setReviewForm({ bookingId: "", text: "", rating: 5 });
      setSuccess("Отзыв отправлен");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при отправке отзыва");
    }
  };

  if (loading) return <p>Загрузка…</p>;

  return (
    <section>
      <h2>Личный кабинет</h2>
      <p className="mb-6">
        {user?.fullName} ({user?.login}) — история заявок и отзывы об услугах
      </p>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div className="card mb-8 !p-0 overflow-hidden">
        <h3 className="px-4 pt-4">Фотогалерея</h3>
        <div className="slider">
          <img
            src={slides[slideIndex]}
            alt={`Слайд ${slideIndex + 1}`}
            className="slider-img"
          />
          <div className="slider-controls">
            <button
              type="button"
              className="slider-btn"
              onClick={() => setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              aria-label="Предыдущий слайд"
            >
              ‹
            </button>
            <button
              type="button"
              className="slider-btn"
              onClick={() => setSlideIndex((prev) => (prev + 1) % slides.length)}
              aria-label="Следующий слайд"
            >
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

      <div className="card mb-8">
        <h3>История заявок</h3>
        {bookings.length === 0 ? (
          <p className="text-muted">Заявок пока нет. Оформите бронирование на отдельной странице.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <article key={b._id} className="booking-item">
                <p className="booking-title">{b.venue?.name}</p>
                <p className="text-muted capitalize">{b.venue?.type}</p>
                <p className="mb-1"><strong>Дата:</strong> {formatDate(b.banquetDate)}</p>
                <p className="mb-1"><strong>Оплата:</strong> {b.paymentMethod}</p>
                <p className={statusClass(b.status)}>{b.status}</p>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Отзывы</h3>
        {reviews.length > 0 && (
          <ul className="mb-6 space-y-3">
            {reviews.map((r) => (
              <li key={r._id} className="border-b border-[#FFDAB9] pb-3">
                <strong>{r.booking?.venue?.name}</strong>
                <span className="text-muted ml-2">★ {r.rating}</span>
                <p className="mb-0 mt-1">{r.text}</p>
              </li>
            ))}
          </ul>
        )}

        {canReview.length > 0 ? (
          <form onSubmit={submitReview}>
            <h3 className="!text-base">Оставить отзыв</h3>
            <div className="form-group">
              <label className="label-field">Заявка (завершённый банкет)</label>
              <select
                className="input-field"
                value={reviewForm.bookingId}
                onChange={(e) =>
                  setReviewForm((f) => ({ ...f, bookingId: e.target.value }))
                }
                required
              >
                <option value="">Выберите заявку</option>
                {canReview.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.venue?.name} — {formatDate(b.banquetDate)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="label-field">Оценка (1–5)</label>
              <input
                type="number"
                min={1}
                max={5}
                className="input-field"
                value={reviewForm.rating}
                onChange={(e) =>
                  setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))
                }
              />
            </div>
            <div className="form-group">
              <label className="label-field">Текст отзыва</label>
              <textarea
                className="input-field min-h-[100px]"
                value={reviewForm.text}
                onChange={(e) => setReviewForm((f) => ({ ...f, text: e.target.value }))}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Отправить отзыв
            </button>
          </form>
        ) : (
          <p className="text-muted">
            Отзыв доступен после статуса «Банкет завершен» и только один раз на заявку.
          </p>
        )}
      </div>
    </section>
  );
}
