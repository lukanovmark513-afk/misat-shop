const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function checkProducts() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });

  const products = await db.all("SELECT * FROM products");
  console.log("Товары в БД:", products.length);
  console.log(products);

  await db.close();
}

checkProducts();
