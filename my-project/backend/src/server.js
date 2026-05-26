const express = require("express");
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const dotenv = require("dotenv");

dotenv.config();

const { getEnv } = require("./config/env");
const { connectDatabase, initSchema, getPool } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const venueRoutes = require("./routes/venueRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const ensureSeedData = require("./ensureSeedData");

const env = getEnv();
const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    store: new pgSession({
      pool: getPool(),
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

connectDatabase()
  .then(() => initSchema())
  .then(() => ensureSeedData())
  .then(() => {
    app.listen(env.port, () => {
      console.log(`API Банкетам.Нет: http://localhost:${env.port}`);
    });
  })
  .catch((err) => {
    console.error("Ошибка запуска:", err.message);
    process.exit(1);
  });
