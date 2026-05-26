const { getPool } = require("./config/db");
const { ORGANIZATION } = require("./constants");

const DEFAULT_VENUES = [
  {
    name: "Банкетный зал «Император»",
    type: "зал",
    description: "Просторный зал для торжеств до 120 гостей.",
    capacity: 120,
    image_url: "/venues/zal.jpg",
  },
  {
    name: "Ресторан «Золотой стол»",
    type: "ресторан",
    description: "Уютный ресторан с авторской кухней.",
    capacity: 80,
    image_url: "/venues/restaurant.jpg",
  },
  {
    name: "Летняя веранда «Солнце»",
    type: "летняя веранда",
    description: "Открытая площадка с видом на сад.",
    capacity: 60,
    image_url: "/venues/summer-veranda.jpg",
  },
  {
    name: "Закрытая веранда «Уют»",
    type: "закрытая веранда",
    description: "Стеклянная веранда для праздников в любую погоду.",
    capacity: 45,
    image_url: "/venues/closed-veranda.jpg",
  },
];

async function ensureOrganization(pool) {
  const { rows } = await pool.query("SELECT id FROM organization WHERE id = 1");
  if (rows.length) return;

  await pool.query(
    `INSERT INTO organization (id, address, hotline) VALUES (1, $1, $2)`,
    [ORGANIZATION.address, ORGANIZATION.hotline]
  );
}

async function ensureVenues(pool) {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM venues");
  if (rows[0].count === 0) {
    for (const v of DEFAULT_VENUES) {
      await pool.query(
        `INSERT INTO venues (name, type, description, capacity, image_url)
         VALUES ($1, $2, $3, $4, $5)`,
        [v.name, v.type, v.description, v.capacity, v.image_url]
      );
    }
    return;
  }

  for (const v of DEFAULT_VENUES) {
    await pool.query(
      `UPDATE venues SET image_url = $1 WHERE type = $2`,
      [v.image_url, v.type]
    );
  }
}

async function ensureSeedData() {
  const pool = getPool();
  await ensureOrganization(pool);
  await ensureVenues(pool);
}

module.exports = ensureSeedData;
