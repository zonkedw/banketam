import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { loginUser } from "../api/authApi";

export default function LoginPage({ onAuth }) {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!login.trim() || !password) {
      setError("Введите логин и пароль");
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
    <AuthCard title="Вход" subtitle="Аутентификация по паре логин — пароль">
      {error && <div className="alert-error">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="label-field" htmlFor="login">
            Логин
          </label>
          <input
            id="login"
            className="input-field"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
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
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Вход…" : "Войти"}
        </button>
      </form>
      <p className="mt-4 text-center">
        <Link to="/register" className="text-[#006400] underline">
          Ещё не зарегистрированы? Регистрация
        </Link>
      </p>
    </AuthCard>
  );
}
