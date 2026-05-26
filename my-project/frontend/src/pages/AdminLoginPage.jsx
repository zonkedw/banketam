import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { adminLogin } from "../api/authApi";

export default function AdminLoginPage({ onAdminAuth }) {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin({ login, password });
      onAdminAuth();
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Неверный логин или пароль администратора");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Вход администратора" subtitle="Доступ к панели управления заявками">
      {error && <div className="alert-error">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="label-field">Логин</label>
          <input
            className="input-field"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="form-group">
          <label className="label-field">Пароль</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Вход…" : "Войти как администратор"}
        </button>
      </form>
    </AuthCard>
  );
}
