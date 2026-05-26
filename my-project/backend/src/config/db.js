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

async function runSqlFile(fileName) {
  const filePath = path.join(__dirname, "../../../database", fileName);
  if (!fs.existsSync(filePath)) return;
  const sql = fs.readFileSync(filePath, "utf8");
  await getPool().query(sql);
}

async function initSchema() {
  await runSqlFile("schema.sql");
  await runSqlFile("migrate_module3.sql");
}

module.exports = { getPool, connectDatabase, initSchema };
