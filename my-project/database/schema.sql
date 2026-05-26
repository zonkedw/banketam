CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  login         VARCHAR(64)  NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  full_name     VARCHAR(255) NOT NULL,
  phone         VARCHAR(32)  NOT NULL,
  email         VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS venues (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  type        VARCHAR(64)  NOT NULL CHECK (type IN (
    'зал', 'ресторан', 'летняя веранда', 'закрытая веранда'
  )),
  description TEXT         DEFAULT '',
  capacity    INTEGER      NOT NULL DEFAULT 50,
  image_url   VARCHAR(512) DEFAULT '',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  venue_id       INTEGER      NOT NULL REFERENCES venues(id) ON DELETE RESTRICT,
  banquet_date   TIMESTAMPTZ  NOT NULL,
  payment_method VARCHAR(64)  NOT NULL CHECK (payment_method IN (
    'Предоплата по QR-коду',
    'Оплата картой МИР',
    'Постоплата в офисе организации'
  )),
  status         VARCHAR(64)  NOT NULL DEFAULT 'Новая' CHECK (status IN (
    'Новая', 'Банкет назначен', 'Банкет завершен'
  )),
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id INTEGER      NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  text       TEXT         NOT NULL,
  rating     SMALLINT     NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_venue ON bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

CREATE TABLE IF NOT EXISTS organization (
  id         INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  address    TEXT         NOT NULL,
  hotline    VARCHAR(64)  NOT NULL,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_banquet_date ON bookings(banquet_date);
