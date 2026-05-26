const { getPool } = require("../config/db");
const { mapReview } = require("../utils/mappers");

const REVIEW_SELECT = `
  SELECT r.*,
         b.id AS booking_id, b.banquet_date AS booking_date, b.status AS booking_status,
         v.id AS venue_id, v.name AS venue_name, v.type AS venue_type
  FROM reviews r
  JOIN bookings b ON b.id = r.booking_id
  JOIN venues v ON v.id = b.venue_id
`;

const myReviews = async (req, res) => {
  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `${REVIEW_SELECT} WHERE r.user_id = $1 ORDER BY r.created_at DESC`,
      [req.session.userId]
    );
    return res.json(rows.map(mapReview));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { bookingId, text, rating } = req.body;

    if (!bookingId || !String(text || "").trim()) {
      return res.status(400).json({ message: "Укажите заявку и текст отзыва" });
    }

    const pool = getPool();
    const booking = await pool.query(
      "SELECT * FROM bookings WHERE id = $1 AND user_id = $2",
      [bookingId, req.session.userId]
    );
    if (!booking.rows.length) {
      return res.status(404).json({ message: "Заявка не найдена" });
    }
    if (booking.rows[0].status !== "Банкет завершен") {
      return res
        .status(400)
        .json({ message: "Отзыв можно оставить только после завершённого банкета" });
    }

    const existing = await pool.query("SELECT id FROM reviews WHERE booking_id = $1", [
      bookingId,
    ]);
    if (existing.rows.length) {
      return res.status(409).json({ message: "Отзыв по этой заявке уже оставлен" });
    }

    const inserted = await pool.query(
      `INSERT INTO reviews (user_id, booking_id, text, rating)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [req.session.userId, bookingId, String(text).trim(), Number(rating) || 5]
    );

    const full = await pool.query(`${REVIEW_SELECT} WHERE r.id = $1`, [
      inserted.rows[0].id,
    ]);
    return res.status(201).json(mapReview(full.rows[0]));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { myReviews, createReview };
