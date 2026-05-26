import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CabinetPage from "./pages/CabinetPage";
import BookingPage from "./pages/BookingPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import { fetchMe, logoutUser } from "./api/authApi";

function RequireUser({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ isAdmin, children }) {
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then(({ data }) => {
        if (data.role === "admin") {
          setIsAdmin(true);
          setUser(null);
        } else {
          setUser(data);
          setIsAdmin(false);
        }
      })
      .catch(() => {
        setUser(null);
        setIsAdmin(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const onUserAuth = (data) => {
    setUser(data);
    setIsAdmin(false);
  };

  const onAdminAuth = () => {
    setIsAdmin(true);
    setUser(null);
  };

  const onLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    setUser(null);
    setIsAdmin(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDD0]">
        <p className="loading-pulse">Загрузка…</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        element={
          <SiteLayout user={user} isAdmin={isAdmin} onLogout={onLogout} />
        }
      >
        <Route index element={<HomePage user={user} />} />
        <Route
          path="register"
          element={
            user ? (
              <Navigate to="/cabinet" replace />
            ) : (
              <RegisterPage onAuth={onUserAuth} />
            )
          }
        />
        <Route
          path="login"
          element={
            user ? (
              <Navigate to="/cabinet" replace />
            ) : (
              <LoginPage onAuth={onUserAuth} />
            )
          }
        />
        <Route
          path="cabinet"
          element={
            <RequireUser user={user}>
              <CabinetPage user={user} />
            </RequireUser>
          }
        />
        <Route
          path="booking"
          element={
            <RequireUser user={user}>
              <BookingPage />
            </RequireUser>
          }
        />
        <Route
          path="admin/login"
          element={
            isAdmin ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLoginPage onAdminAuth={onAdminAuth} />
            )
          }
        />
        <Route
          path="admin"
          element={
            <RequireAdmin isAdmin={isAdmin}>
              <AdminPanelPage />
            </RequireAdmin>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
