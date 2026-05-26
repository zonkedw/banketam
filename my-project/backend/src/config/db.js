const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const { getEnv } = require("./env");

let pool;

function getPool() {
  if (!pool) {
    const { databaseUrl } = getEnv();
    pool = new Pool({ connectionString: databaseUrl });
  }
  return pool;
}

async function connectDatabase() {
  const p = getPool();
  await p.query("SELECT 1");
  console.log("PostgreSQL подключена (Банкетам.Нет)");
}

async function initSchema() {
  const schemaPath = path.join(__dirname, "../../../database/schema.sql");
  if (!fs.existsSync(schemaPath)) return;
  const sql = fs.readFileSync(schemaPath, "utf8");
  await getPool().query(sql);
}

module.exports = { getPool, connectDatabase, initSchema };
