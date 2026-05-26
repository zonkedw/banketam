import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { loginUser } from "../api/authApi";

export default function LoginPage({ onAuth }) {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldError("");

    if (!login.trim() || !password) {
      setFieldError("Введите логин и пароль");
      return;
    }

    setLoading(true);
    try {
      const { data } = await loginUser({ login, password });
      onAuth({ login: data.login, fullName: data.fullName, role: "user" });
      navigate("/cabinet");
    } catch (err) {
      setError(err.response?.data?.message || "Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-frame">
      <AuthCard title="Вход" subtitle="Аутентификация по логину и паролю">
        {error && <div className="alert-error">{error}</div>}
        {fieldError && <div className="alert-error">{fieldError}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="label-field" htmlFor="login">Логин</label>
            <input id="login" className="input-field" value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" required />
          </div>
          <div className="form-group">
            <label className="label-field" htmlFor="password">Пароль</label>
            <input id="password" type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
        <p className="mt-4 text-center">
          <Link to="/register" className="text-[#006400] underline">Ещё не зарегистрированы? Регистрация</Link>
        </p>
      </AuthCard>
    </div>
  );
}
