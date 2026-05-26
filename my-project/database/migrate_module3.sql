-- Модуль 3: контакты организации и новые способы оплаты

CREATE TABLE IF NOT EXISTS organization (
  id       INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  address  TEXT    NOT NULL,
  hotline  VARCHAR(64) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_payment_method_check;

UPDATE bookings SET payment_method = 'Предоплата по QR-коду'
  WHERE payment_method IN ('Наличные', 'наличные');

UPDATE bookings SET payment_method = 'Оплата картой МИР'
  WHERE payment_method IN ('Банковская карта', 'банковская карта');

UPDATE bookings SET payment_method = 'Постоплата в офисе организации'
  WHERE payment_method IN ('Безналичный расчёт', 'безналичный расчёт');

ALTER TABLE bookings ADD CONSTRAINT bookings_payment_method_check CHECK (
  payment_method IN (
    'Предоплата по QR-коду',
    'Оплата картой МИР',
    'Постоплата в офисе организации'
  )
);

CREATE INDEX IF NOT EXISTS idx_bookings_banquet_date ON bookings(banquet_date);

ALTER TABLE venues ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
