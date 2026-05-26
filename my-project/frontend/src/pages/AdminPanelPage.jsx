import { useEffect, useState } from "react";
import { fetchAllBookings, updateBookingStatus } from "../api/bookingsApi";

const STATUSES = ["Новая", "Банкет назначен", "Банкет завершен"];

function formatDate(value) {
  return new Date(value).toLocaleString("ru-RU");
}

export default function AdminPanelPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await fetchAllBookings();
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка загрузки заявок");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onStatusChange = async (id, status) => {
    setError("");
    try {
      const { data } = await updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => (b._id === id ? data : b)));
    } catch (err) {
      setError(err.response?.data?.message || "Не удалось обновить статус");
    }
  };

  if (loading) return <p>Загрузка заявок…</p>;

  return (
    <section>
      <h2>Панель администратора</h2>
      <p className="mb-6 text-muted">Просмотр всех заявок и изменение статуса</p>

      {error && <div className="alert-error">{error}</div>}

      <div className="card overflow-x-auto">
        {bookings.length === 0 ? (
          <p className="text-muted">Заявок пока нет</p>
        ) : (
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-[#FFDAB9]">
                <th className="py-2 pr-2">Клиент</th>
                <th className="py-2 pr-2">Помещение</th>
                <th className="py-2 pr-2">Дата</th>
                <th className="py-2 pr-2">Оплата</th>
                <th className="py-2">Статус</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-[#FFDAB9]">
                  <td className="py-3 pr-2">
                    <strong>{b.user?.fullName}</strong>
                    <span className="text-muted block text-xs">
                      {b.user?.login} · {b.user?.phone}
                    </span>
                  </td>
                  <td className="py-3 pr-2">
                    {b.venue?.name}
                    <span className="text-muted block text-xs">{b.venue?.type}</span>
                  </td>
                  <td className="py-3 pr-2">{formatDate(b.banquetDate)}</td>
                  <td className="py-3 pr-2">{b.paymentMethod}</td>
                  <td className="py-3">
                    <select
                      className="input-field !w-auto min-w-[180px]"
                      value={b.status}
                      onChange={(e) => onStatusChange(b._id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
