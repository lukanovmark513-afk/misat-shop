const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function checkSchema() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });
  
  const schema = await db.all("PRAGMA table_info(products)");
  console.log("Структура таблицы products:");
  console.table(schema.map(col => ({ name: col.name, type: col.type })));
  
  await db.close();
}

checkSchema();
