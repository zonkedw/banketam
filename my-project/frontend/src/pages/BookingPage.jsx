import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking, fetchBookingMeta } from "../api/bookingsApi";
import { fetchVenues } from "../api/venuesApi";

export default function BookingPage() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [venueId, setVenueId] = useState("");
  const [banquetDate, setBanquetDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetchVenues(), fetchBookingMeta()])
      .then(([vRes, mRes]) => {
        setVenues(vRes.data);
        setPaymentMethods(mRes.data.paymentMethods);
        if (vRes.data[0]) setVenueId(vRes.data[0]._id);
        if (mRes.data.paymentMethods[0]) setPaymentMethod(mRes.data.paymentMethods[0]);
      })
      .catch(() => setError("Не удалось загрузить список помещений"));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await createBooking({ venueId, banquetDate, paymentMethod });
      setSuccess("Заявка отправлена на согласование администратору");
      setTimeout(() => navigate("/cabinet"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при создании заявки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Оформление заявки</h2>
      <p className="mb-6 text-muted">
        Выберите помещение, дату начала банкета и способ оплаты. Статус по умолчанию — «Новая».
      </p>

      <div className="card max-w-xl">
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="label-field">Помещение</label>
            <select
              className="input-field"
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              required
            >
              {venues.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name} ({v.type})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label-field">Дата и время начала банкета</label>
            <input
              type="datetime-local"
              className="input-field"
              value={banquetDate}
              onChange={(e) => setBanquetDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label-field">Способ оплаты</label>
            <select
              className="input-field"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              {paymentMethods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Отправка…" : "Отправить заявку"}
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {venues.map((v) => (
          <article key={v._id} className="card overflow-hidden !p-0">
            {v.imageUrl && (
              <img
                src={v.imageUrl}
                alt={v.name}
                className="h-44 w-full object-cover"
              />
            )}
            <div className="p-4">
              <h3>{v.name}</h3>
              <p className="text-muted capitalize">{v.type}</p>
              <p>{v.description}</p>
              <p className="text-muted">Вместимость: до {v.capacity} гостей</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
