import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchVenues } from "../api/venuesApi";

export default function HomePage({ user }) {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    fetchVenues()
      .then(({ data }) => setVenues(data))
      .catch(() => {});
  }, []);

  return (
    <section>
      <h2>Добро пожаловать</h2>
      <p className="mb-6">
        Портал «Банкетам.Нет» — бронирование помещений для банкетов: зал, ресторан,
        летняя веранда, закрытая веранда. Укажите дату и способ оплаты — заявка
        уйдёт администратору на согласование.
      </p>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="card">
          <h3>Для гостей</h3>
          <p className="mb-4">
            Зарегистрируйтесь, оформите заявку и следите за статусом в личном кабинете.
          </p>
          {user ? (
            <Link to="/booking" className="btn-primary">
              Оформить заявку
            </Link>
          ) : (
            <Link to="/register" className="btn-primary">
              Регистрация
            </Link>
          )}
        </div>
        <div className="card flex items-center justify-center">
          <img src="/module2/social.png" alt="Социальные сети" className="max-h-28 opacity-90" />
        </div>
      </div>

      <h2>Наши помещения</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {venues.map((v) => (
          <article key={v._id} className="card overflow-hidden !p-0">
            {v.imageUrl && (
              <img src={v.imageUrl} alt={v.name} className="h-40 w-full object-cover" />
            )}
            <div className="p-4">
              <h3 className="!text-lg">{v.name}</h3>
              <p className="text-muted capitalize">{v.type}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
