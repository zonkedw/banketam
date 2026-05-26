const { getPool } = require("./config/db");

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

async function ensureSeedData() {
  const pool = getPool();
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM venues");
  if (rows[0].count > 0) return;

  for (const v of DEFAULT_VENUES) {
    await pool.query(
      `INSERT INTO venues (name, type, description, capacity, image_url)
       VALUES ($1, $2, $3, $4, $5)`,
      [v.name, v.type, v.description, v.capacity, v.image_url]
    );
  }
}

module.exports = ensureSeedData;
