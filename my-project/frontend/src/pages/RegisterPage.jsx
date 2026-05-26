import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { registerUser } from "../api/authApi";

const LOGIN_RE = /^[a-zA-Z0-9]{6,}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getFieldErrors(form) {
  const errors = {};
  if (!LOGIN_RE.test(form.login)) {
    errors.login = "Только латиница и цифры, минимум 6 символов";
  }
  if (form.password.length < 8) {
    errors.password = "Не менее 8 символов";
  }
  if (!form.fullName.trim()) {
    errors.fullName = "Введите ФИО";
  }
  if (!form.phone.trim()) {
    errors.phone = "Введите телефон";
  }
  if (!EMAIL_RE.test(form.email)) {
    errors.email = "Введите корректный e-mail";
  }
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errors = getFieldErrors(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

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
    <div className="mobile-frame">
      <AuthCard title="Регистрация" subtitle="Все поля обязательны">
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="label-field" htmlFor="login">Логин</label>
            <input id="login" name="login" className="input-field" value={form.login} onChange={onChange} autoComplete="username" required />
            {fieldErrors.login && <p className="field-error">{fieldErrors.login}</p>}
          </div>

          <div className="form-group">
            <label className="label-field" htmlFor="password">Пароль</label>
            <input id="password" name="password" type="password" className="input-field" value={form.password} onChange={onChange} autoComplete="new-password" required />
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>

          <div className="form-group">
            <label className="label-field" htmlFor="fullName">ФИО</label>
            <input id="fullName" name="fullName" className="input-field" value={form.fullName} onChange={onChange} required />
            {fieldErrors.fullName && <p className="field-error">{fieldErrors.fullName}</p>}
          </div>

          <div className="form-group">
            <label className="label-field" htmlFor="phone">Телефон</label>
            <input id="phone" name="phone" type="tel" className="input-field" value={form.phone} onChange={onChange} required />
            {fieldErrors.phone && <p className="field-error">{fieldErrors.phone}</p>}
          </div>

          <div className="form-group">
            <label className="label-field" htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" className="input-field" value={form.email} onChange={onChange} required />
            {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Сохранение..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="mt-4 text-center">
          <Link to="/login" className="text-[#006400] underline">Уже зарегистрированы? Вход</Link>
        </p>
      </AuthCard>
    </div>
  );
}
