const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function checkDB() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });

  // Проверяем таблицы
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  console.log("Таблицы в БД:", tables.map(t => t.name));

  // Проверяем пользователей
  const users = await db.all("SELECT id, email, first_name, last_name, role FROM users");
  console.log("Пользователи:", users);

  await db.close();
}

checkDB();
