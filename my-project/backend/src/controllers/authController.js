const bcrypt = require("bcryptjs");
const { getPool } = require("../config/db");
const { getEnv } = require("../config/env");
const { validateRegistration } = require("../utils/validation");
const { mapUser } = require("../utils/mappers");

const normalizeLogin = (value) => String(value || "").trim().toLowerCase();

const register = async (req, res) => {
  try {
    const login = normalizeLogin(req.body.login);
    const password = String(req.body.password || "");
    const fullName = String(req.body.fullName || "").trim();
    const phone = String(req.body.phone || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();

    const errors = validateRegistration({ login, password, fullName, phone, email });
    if (errors.length) {
      return res.status(400).json({ message: errors.join("; ") });
    }

    const pool = getPool();
    const exists = await pool.query("SELECT id FROM users WHERE login = $1", [login]);
    if (exists.rows.length) {
      return res.status(409).json({ message: "Логин уже занят. Выберите другой." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const inserted = await pool.query(
      `INSERT INTO users (login, password_hash, full_name, phone, email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [login, passwordHash, fullName, phone, email]
    );
    const user = mapUser(inserted.rows[0]);

    req.session.userId = user._id;
    req.session.login = user.login;
    req.session.isAdmin = false;

    return res.status(201).json({
      message: "Регистрация успешна",
      login: user.login,
      fullName: user.fullName,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const loginValue = normalizeLogin(req.body.login);
    const password = String(req.body.password || "");

    if (!loginValue || !password) {
      return res.status(400).json({ message: "Введите логин и пароль" });
    }

    const pool = getPool();
    const result = await pool.query("SELECT * FROM users WHERE login = $1", [loginValue]);
    if (!result.rows.length) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    const row = result.rows[0];
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    req.session.userId = row.id;
    req.session.login = row.login;
    req.session.isAdmin = false;

    return res.json({
      message: "Вход выполнен",
      login: row.login,
      fullName: row.full_name,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { adminLogin: expectedLogin, adminPassword: expectedPassword } = getEnv();
    const loginValue = String(req.body.login || "").trim();
    const password = String(req.body.password || "");

    if (loginValue !== expectedLogin || password !== expectedPassword) {
      return res.status(401).json({ message: "Неверный логин или пароль администратора" });
    }

    req.session.isAdmin = true;
    req.session.userId = null;
    req.session.login = "admin";

    return res.json({ message: "Вход администратора выполнен" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const me = async (req, res) => {
  if (req.session.isAdmin) {
    return res.json({ role: "admin", login: "Admin26" });
  }
  if (!req.session.userId) {
    return res.status(401).json({ message: "Не авторизован" });
  }

  const pool = getPool();
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.session.userId]);
  if (!result.rows.length) {
    return res.status(401).json({ message: "Пользователь не найден" });
  }

  const user = mapUser(result.rows[0]);
  return res.json({
    role: "user",
    login: user.login,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
  });
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Выход выполнен" });
  });
};

module.exports = { register, login, adminLogin, me, logout };
