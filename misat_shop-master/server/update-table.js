const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function updateTable() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });

  // Добавляем недостающие колонки
  try {
    await db.exec(`ALTER TABLE products ADD COLUMN stockType TEXT DEFAULT 'in_stock'`);
    console.log("✅ Добавлена колонка stockType");
  } catch (e) {
    console.log("Колонка stockType уже существует");
  }

  try {
    await db.exec(`ALTER TABLE products ADD COLUMN preorderDays INTEGER`);
    console.log("✅ Добавлена колонка preorderDays");
  } catch (e) {
    console.log("Колонка preorderDays уже существует");
  }

  try {
    await db.exec(`ALTER TABLE products ADD COLUMN images TEXT`);
    console.log("✅ Добавлена колонка images");
  } catch (e) {
    console.log("Колонка images уже существует");
  }

  console.log("✅ Таблица products обновлена");
  await db.close();
}

updateTable();
