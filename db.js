const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


async function testConnection() {
  try {
    await db.query("SELECT 1");
    console.log(" Підключення до БД успішне");
  } catch (err) {
    console.error(" Помилка підключення до БД:", err.message);
  }
}

testConnection();

module.exports = db;