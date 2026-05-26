const { getPool } = require("../config/db");
const { PAYMENT_METHODS, BOOKING_STATUSES } = require("../constants");
const { mapBooking } = require("../utils/mappers");

const BOOKING_SELECT = `
  SELECT b.*,
         v.id AS venue_id, v.name AS venue_name, v.type AS venue_type, v.image_url AS venue_image_url,
         u.id AS user_id, u.login AS user_login, u.full_name AS user_full_name,
         u.phone AS user_phone, u.email AS user_email
  FROM bookings b
  JOIN venues v ON v.id = b.venue_id
  JOIN users u ON u.id = b.user_id
`;

const createBooking = async (req, res) => {
  try {
    const { venueId, banquetDate, paymentMethod } = req.body;

    if (!venueId || !banquetDate || !paymentMethod) {
      return res.status(400).json({ message: "Заполните все поля заявки" });
    }
    if (!PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ message: "Выберите способ оплаты из списка" });
    }

    const date = new Date(banquetDate);
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ message: "Укажите корректную дату банкета" });
    }
    if (date < new Date()) {
      return res.status(400).json({ message: "Дата банкета не может быть в прошлом" });
    }

    const pool = getPool();
    const inserted = await pool.query(
      `INSERT INTO bookings (user_id, venue_id, banquet_date, payment_method, status)
       VALUES ($1, $2, $3, $4, 'Новая')
       RETURNING id`,
      [req.session.userId, venueId, date, paymentMethod]
    );

    const full = await pool.query(`${BOOKING_SELECT} WHERE b.id = $1`, [
      inserted.rows[0].id,
    ]);
    return res.status(201).json(mapBooking(full.rows[0]));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const myBookings = async (req, res) => {
  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `${BOOKING_SELECT} WHERE b.user_id = $1 ORDER BY b.created_at DESC`,
      [req.session.userId]
    );
    return res.json(rows.map(mapBooking));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const listAllBookings = async (_req, res) => {
  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `${BOOKING_SELECT} ORDER BY b.created_at DESC`
    );
    return res.json(rows.map(mapBooking));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!BOOKING_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Недопустимый статус заявки" });
    }

    const pool = getPool();
    const updated = await pool.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING id`,
      [status, req.params.id]
    );
    if (!updated.rows.length) {
      return res.status(404).json({ message: "Заявка не найдена" });
    }

    const full = await pool.query(`${BOOKING_SELECT} WHERE b.id = $1`, [
      req.params.id,
    ]);
    return res.json(mapBooking(full.rows[0]));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const meta = (_req, res) => {
  res.json({ paymentMethods: PAYMENT_METHODS, statuses: BOOKING_STATUSES });
};

module.exports = {
  createBooking,
  myBookings,
  listAllBookings,
  updateBookingStatus,
  meta,
};
