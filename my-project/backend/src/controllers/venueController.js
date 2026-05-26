const { getPool } = require("../config/db");
const { mapVenue } = require("../utils/mappers");

const listVenues = async (_req, res) => {
  try {
    const pool = getPool();
    const { rows } = await pool.query(
      "SELECT * FROM venues ORDER BY type, name"
    );
    return res.json(rows.map(mapVenue));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { listVenues };
