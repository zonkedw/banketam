import { useEffect, useState } from "react";
import { fetchMyBookings } from "../api/bookingsApi";
import { createReview, fetchMyReviews } from "../api/reviewsApi";
import ImageSlider from "../components/ImageSlider";
import { formatDateTime } from "../utils/formatDate";

function statusClass(status) {
  if (status === "Новая") return "status-new";
  if (status === "Банкет назначен") return "status-assigned";
  return "status-done";
}

export default function CabinetPage({ user }) {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reviewForm, setReviewForm] = useState({ bookingId: "", text: "", rating: 5 });
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p className="loading-pulse">Загрузка…</p>;
  }

  return (
    <section className="page-enter">
      <h2>Личный кабинет</h2>
      <p className="mb-6">
        {user?.fullName} ({user?.login}) — история заявок и отзывы об услугах
      </p>

      {error && <div className="alert-error animate-in">{error}</div>}
      {success && <div className="alert-success animate-in">{success}</div>}

      <ImageSlider />

      <div className="card mb-8 animate-in">
        <h3>История заявок</h3>
        {bookings.length === 0 ? (
          <p className="text-muted">Заявок пока нет. Оформите бронирование на отдельной странице.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <article key={b._id} className="booking-item">
                <p className="booking-title">{b.venue?.name}</p>
                <p className="text-muted capitalize">{b.venue?.type}</p>
                <p className="mb-1">
                  <strong>Дата:</strong> {formatDateTime(b.banquetDate)}
                </p>
                <p className="mb-1">
                  <strong>Оплата:</strong> {b.paymentMethod}
                </p>
                <p className={statusClass(b.status)}>{b.status}</p>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="card animate-in">
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
                    {b.venue?.name} — {formatDateTime(b.banquetDate)}
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
