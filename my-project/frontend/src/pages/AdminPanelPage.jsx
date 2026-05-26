import { useEffect, useState } from "react";
import { fetchAllBookings, updateBookingStatus } from "../api/bookingsApi";

const STATUSES = ["Новая", "Банкет назначен", "Банкет завершен"];

function formatDate(value) {
  return new Date(value).toLocaleString("ru-RU");
}

export default function AdminPanelPage() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Все");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("dateDesc");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");
  const [pendingStatus, setPendingStatus] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const pageSize = 5;

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

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const onStatusChange = async () => {
    if (!pendingStatus) return;
    setError("");
    try {
      const { data } = await updateBookingStatus(pendingStatus.id, pendingStatus.status);
      setBookings((prev) =>
        prev.map((b) => (b._id === pendingStatus.id ? data : b))
      );
      setToast("Статус заявки обновлен");
      setPendingStatus(null);
    } catch (err) {
      setError(err.response?.data?.message || "Не удалось обновить статус");
    }
  };

  const filteredBookings = bookings
    .filter((b) => statusFilter === "Все" || b.status === statusFilter)
    .filter((b) => {
      const query = search.trim().toLowerCase();
      if (!query) return true;
      return (
        b.user?.fullName?.toLowerCase().includes(query) ||
        b.user?.login?.toLowerCase().includes(query) ||
        b.venue?.name?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortKey === "dateAsc") {
        return new Date(a.banquetDate).getTime() - new Date(b.banquetDate).getTime();
      }
      if (sortKey === "clientAsc") {
        return String(a.user?.fullName || "").localeCompare(String(b.user?.fullName || ""), "ru");
      }
      return new Date(b.banquetDate).getTime() - new Date(a.banquetDate).getTime();
    });

  const pageCount = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const normalizedPage = Math.min(page, pageCount);
  const pageItems = filteredBookings.slice(
    (normalizedPage - 1) * pageSize,
    normalizedPage * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search, sortKey]);

  if (loading) return <p>Загрузка заявок…</p>;

  return (
    <section>
      <h2>Панель администратора</h2>
      <p className="mb-4 text-muted">Фильтры, сортировка, постраничная навигация и изменение статуса</p>

      {error && <div className="alert-error">{error}</div>}
      {toast && <div className="alert-toast">{toast}</div>}

      <div className="card mb-4">
        <div className="form-group">
          <label className="label-field">Поиск по клиенту, логину или помещению</label>
          <input
            className="input-field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Например, Иванов"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label-field">Фильтр по статусу</label>
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Все">Все</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Сортировка</label>
            <select
              className="input-field"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="dateDesc">Сначала ближайшие/новые даты</option>
              <option value="dateAsc">Сначала ранние даты</option>
              <option value="clientAsc">По ФИО клиента (А-Я)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        {pageItems.length === 0 ? (
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
              {pageItems.map((b) => (
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
                      onChange={(e) =>
                        setPendingStatus({
                          id: b._id,
                          client: b.user?.fullName,
                          status: e.target.value,
                        })
                      }
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

      <div className="pagination">
        <button
          type="button"
          className="btn-secondary !py-2"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={normalizedPage === 1}
        >
          Назад
        </button>
        <span className="text-muted !text-sm">
          Страница {normalizedPage} из {pageCount}
        </span>
        <button
          type="button"
          className="btn-secondary !py-2"
          onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
          disabled={normalizedPage === pageCount}
        >
          Вперед
        </button>
      </div>

      {pendingStatus && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Подтвердите изменение</h3>
            <p className="mb-4">
              Клиент: <strong>{pendingStatus.client}</strong>
              <br />
              Новый статус: <strong>{pendingStatus.status}</strong>
            </p>
            <div className="modal-actions">
              <button type="button" className="btn-secondary !py-2" onClick={() => setPendingStatus(null)}>
                Отмена
              </button>
              <button type="button" className="btn-primary !py-2" onClick={onStatusChange}>
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
