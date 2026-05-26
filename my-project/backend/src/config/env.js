function parsePort(raw, fallback) {
  const n = Number(String(raw || "").trim());
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function getEnv() {
  const databaseUrl =
    process.env.DATABASE_URL?.trim() ||
    buildDatabaseUrlFromParts();

  return {
    port: parsePort(process.env.PORT, 5827),
    databaseUrl,
    sessionSecret: process.env.SESSION_SECRET?.trim() || "banketam-dev-session-secret",
    frontendUrl: process.env.FRONTEND_URL?.trim() || "http://localhost:5828",
    adminLogin: process.env.ADMIN_LOGIN?.trim() || "Admin26",
    adminPassword: process.env.ADMIN_PASSWORD?.trim() || "Demo20",
    nodeEnv: process.env.NODE_ENV || "development",
  };
}

function buildDatabaseUrlFromParts() {
  const user = process.env.PGUSER || "postgres";
  const password = process.env.PGPASSWORD || "postgres";
  const host = process.env.PGHOST || "127.0.0.1";
  const port = process.env.PGPORT || "5432";
  const database = process.env.PGDATABASE || "banketam";
  const encoded = encodeURIComponent(password);
  return `postgresql://${user}:${encoded}@${host}:${port}/${database}`;
}

module.exports = { getEnv };
