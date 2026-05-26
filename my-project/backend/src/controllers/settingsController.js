const { getPool } = require("../config/db");
const { PAYMENT_METHODS, BOOKING_STATUSES, ORGANIZATION } = require("../constants");

const getSettings = async (_req, res) => {
  try {
    const pool = getPool();
    const { rows } = await pool.query(
      "SELECT address, hotline FROM organization WHERE id = 1"
    );
    const org = rows[0] || ORGANIZATION;

    return res.json({
      address: org.address,
      hotline: org.hotline,
      paymentMethods: PAYMENT_METHODS,
      bookingStatuses: BOOKING_STATUSES,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings };
