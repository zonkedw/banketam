import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { registerUser } from "../api/authApi";

const LOGIN_RE = /^[a-zA-Z0-9]{6,}$/;

function validateClient(form) {
  const errors = [];
  if (!LOGIN_RE.test(form.login)) {
    errors.push("Логин: только латиница и цифры, минимум 6 символов");
  }
  if (form.password.length < 8) {
    errors.push("Пароль: не менее 8 символов");
  }
  if (!form.fullName.trim()) errors.push("Укажите ФИО");
  if (!form.phone.trim()) errors.push("Укажите телефон");
  if (!form.email.includes("@")) errors.push("Укажите корректный e-mail");
  return errors;
}

export default function RegisterPage({ onAuth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    login: "",
    password: "",
    fullName: "",
    phone: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const clientErrors = validateClient(form);
    if (clientErrors.length) {
      setError(clientErrors.join("; "));
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      onAuth({ login: data.login, fullName: data.fullName, role: "user" });
      navigate("/cabinet");
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Регистрация"
      subtitle="Все поля обязательны. Логин — латиница и цифры (от 6 символов), пароль — от 8 символов."
    >
      {error && <div className="alert-error">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="label-field" htmlFor="login">
            Логин
          </label>
          <input
            id="login"
            name="login"
            className="input-field"
            value={form.login}
            onChange={onChange}
            autoComplete="username"
            required
          />
        </div>
        <div className="form-group">
          <label className="label-field" htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="input-field"
            value={form.password}
            onChange={onChange}
            autoComplete="new-password"
            required
          />
        </div>
        <div className="form-group">
          <label className="label-field" htmlFor="fullName">
            ФИО
          </label>
          <input
            id="fullName"
            name="fullName"
            className="input-field"
            value={form.fullName}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="label-field" htmlFor="phone">
            Телефон
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="input-field"
            value={form.phone}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="label-field" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="input-field"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Сохранение…" : "Зарегистрироваться"}
        </button>
      </form>
      <p className="mt-4 text-center">
        <Link to="/login" className="text-[#006400] underline">
          Уже зарегистрированы? Вход
        </Link>
      </p>
    </AuthCard>
  );
}
