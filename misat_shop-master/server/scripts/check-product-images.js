const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../database.sqlite");
const db = new sqlite3.Database(dbPath);

console.log("🖼️ ПРОВЕРКА КАРТИНОК ТОВАРОВ");
console.log("=".repeat(50));

db.all("SELECT id, name, image, images FROM products", (err, products) => {
  if (err) {
    console.error("❌ Ошибка:", err.message);
    db.close();
    return;
  }

  if (products.length === 0) {
    console.log("❌ Товаров нет в базе данных!");
    console.log("💡 Запустите: node scripts/add-products-with-images.js");
    db.close();
    return;
  }

  console.log(`📦 Найдено товаров: ${products.length}\n`);

  products.forEach((p, index) => {
    console.log(`${index + 1}. ID: ${p.id}`);
    console.log(`   Название: ${p.name}`);
    console.log(`   image: ${p.image || "❌ ПУСТО"}`);
    console.log(`   images: ${p.images || "❌ ПУСТО"}`);
    console.log("");
  });

  // Проверяем, сколько товаров без картинок
  const noImage = products.filter(p => !p.image || p.image === "");
  const noImages = products.filter(p => !p.images || p.images === "[]" || p.images === "");

  console.log("=".repeat(50));
  console.log("📊 СТАТИСТИКА:");
  console.log(`   ✅ Всего товаров: ${products.length}`);
  console.log(`   ❌ Без image: ${noImage.length}`);
  console.log(`   ❌ Без images: ${noImages.length}`);

  if (noImage.length > 0 || noImages.length > 0) {
    console.log("\n💡 Нужно добавить картинки!");
    console.log("   Запустите: node scripts/add-products-with-images.js");
  } else {
    console.log("\n✅ Все товары имеют картинки!");
  }

  db.close();
});
