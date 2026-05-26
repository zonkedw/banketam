import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { fetchSettings } from "../api/settingsApi";

export default function SiteLayout({ user, onLogout, isAdmin }) {
  const [contacts, setContacts] = useState({ address: "", hotline: "" });

  useEffect(() => {
    fetchSettings()
      .then(({ data }) =>
        setContacts({ address: data.address, hotline: data.hotline })
      )
      .catch(() => {});
  }, []);

  return (
    <div className="page-shell-wrap min-h-screen bg-[#fff6df] py-3">
      <div className="app-shell">
        <header className="border-b-4 border-[#DAA520] bg-[#FFDAB9] px-3 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-3 no-underline">
              <img
                src="/logo.png"
                alt="Банкетам.Нет"
                className="h-12 w-12 object-contain"
                loading="lazy"
              />
              <div>
                <h1 className="!mb-0 text-2xl">Банкетам.Нет</h1>
                <p className="text-muted !text-xs">
                  Бронирование помещений для банкетов
                </p>
              </div>
            </Link>
            <nav className="flex flex-wrap items-center gap-2 text-sm">
              {!isAdmin && user && (
                <>
                  <Link to="/cabinet" className="btn-secondary !py-2 !text-sm">
                    Личный кабинет
                  </Link>
                  <Link to="/booking" className="btn-primary !py-2 !text-sm">
                    Оформить заявку
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" className="btn-primary !py-2 !text-sm">
                  Панель администратора
                </Link>
              )}
              {user || isAdmin ? (
                <button
                  type="button"
                  className="btn-secondary !py-2 !text-sm"
                  onClick={onLogout}
                >
                  Выйти
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary !py-2 !text-sm">
                    Вход
                  </Link>
                  <Link to="/register" className="btn-primary !py-2 !text-sm">
                    Регистрация
                  </Link>
                </>
              )}
              <Link to="/admin/login" className="text-muted underline !text-xs">
                Админ
              </Link>
            </nav>
          </div>
        </header>
        <main className="page-main px-3 py-5">
          <Outlet />
        </main>
        <footer className="border-t-2 border-[#DAA520] bg-[#FFDAB9] px-3 py-4 text-center">
          {contacts.address && (
            <p className="text-muted mb-1">{contacts.address}</p>
          )}
          {contacts.hotline && (
            <p className="mb-1">
              <a href={`tel:${contacts.hotline.replace(/\s/g, "")}`} className="link-phone">
                {contacts.hotline}
              </a>
            </p>
          )}
          <p className="text-muted mb-0">
            зал · ресторан · летняя веранда · закрытая веранда
          </p>
        </footer>
      </div>
    </div>
  );
}
