const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "../database.sqlite");

if (!fs.existsSync(dbPath)) {
  console.error("❌ База данных не найдена!");
  process.exit(1);
}

const db = new sqlite3.Database(dbPath);

console.log("=".repeat(60));
console.log("📊 ПОЛНАЯ ПРОВЕРКА БАЗЫ ДАННЫХ MISAT");
console.log("=".repeat(60));
console.log("");

// 1. Список всех таблиц
db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, tables) => {
  if (err) {
    console.error("❌ Ошибка:", err);
    db.close();
    return;
  }
  
  console.log(`📋 ТАБЛИЦЫ (${tables.length} шт.):`);
  console.log("-".repeat(40));
  tables.forEach(t => {
    console.log(`  ✅ ${t.name}`);
  });
  console.log("");

  // 2. Проверка структуры каждой таблицы
  let checkCount = 0;
  tables.forEach((table) => {
    db.all(`PRAGMA table_info(${table.name})`, (err, columns) => {
      checkCount++;
      console.log(`📌 Таблица: ${table.name} (${columns.length} колонок)`);
      columns.forEach(col => {
        const pk = col.pk ? "🔑" : "  ";
        const notNull = col.notnull ? "NOT NULL" : "";
        console.log(`   ${pk} ${col.name} (${col.type}) ${notNull}`);
      });
      console.log("");
      
      // 3. Количество записей
      db.get(`SELECT COUNT(*) as count FROM ${table.name}`, (err, row) => {
        console.log(`   📊 Записей: ${row?.count || 0}`);
        console.log("");
        
        if (checkCount === tables.length) {
          // 4. Проверка пользователей
          checkUsers();
        }
      });
    });
  });
});

// 4. Проверка пользователей
function checkUsers() {
  console.log("=".repeat(60));
  console.log("👤 ПОЛЬЗОВАТЕЛИ");
  console.log("=".repeat(60));
  
  db.all("SELECT id, email, first_name, last_name, phone, role, is_active, created_at FROM users", (err, users) => {
    if (err) {
      console.error("❌ Ошибка:", err);
    } else {
      console.log(`📊 Всего пользователей: ${users.length}`);
      console.log("");
      users.forEach(u => {
        console.log(`  👤 ID: ${u.id}`);
        console.log(`     📧 ${u.email}`);
        console.log(`     👤 ${u.first_name || ""} ${u.last_name || ""}`);
        console.log(`     📱 ${u.phone || "—"}`);
        console.log(`     🎯 Роль: ${u.role}`);
        console.log(`     ✅ Активен: ${u.is_active ? "Да" : "Нет"}`);
        console.log(`     📅 Создан: ${u.created_at}`);
        console.log("");
      });
    }
    
    // 5. Проверка администратора
    checkAdmin();
  });
}

// 5. Проверка администратора
function checkAdmin() {
  console.log("=".repeat(60));
  console.log("👑 АДМИНИСТРАТОР");
  console.log("=".repeat(60));
  
  db.get("SELECT * FROM users WHERE role = 'admin'", (err, admin) => {
    if (err) {
      console.error("❌ Ошибка:", err);
    } else if (admin) {
      console.log(`  ✅ Администратор найден:`);
      console.log(`     📧 Email: ${admin.email}`);
      console.log(`     👤 Имя: ${admin.first_name} ${admin.last_name}`);
      console.log(`     🎯 Роль: ${admin.role}`);
      console.log(`     🔑 Пароль: admin123 (если не меняли)`);
    } else {
      console.log("  ❌ Администратор НЕ НАЙДЕН!");
      console.log("  💡 Создайте: npm run db:create-admin");
    }
    console.log("");
    
    // 6. Проверка категорий
    checkCategories();
  });
}

// 6. Проверка категорий
function checkCategories() {
  console.log("=".repeat(60));
  console.log("📂 КАТЕГОРИИ");
  console.log("=".repeat(60));
  
  db.all("SELECT * FROM categories ORDER BY sort_order", (err, categories) => {
    if (err) {
      console.error("❌ Ошибка:", err);
    } else if (categories.length > 0) {
      console.log(`📊 Всего категорий: ${categories.length}`);
      console.log("");
      categories.forEach(c => {
        console.log(`  📁 ${c.name} (slug: ${c.slug})`);
        console.log(`     🆔 ID: ${c.id}`);
        console.log(`     📊 Сортировка: ${c.sort_order}`);
        console.log(`     ✅ Активна: ${c.is_active ? "Да" : "Нет"}`);
        console.log("");
      });
    } else {
      console.log("  ⚠️ Категории не найдены");
      console.log("  💡 Добавьте категории через админку или SQL");
    }
    console.log("");
    
    // 7. Проверка товаров
    checkProducts();
  });
}

// 7. Проверка товаров
function checkProducts() {
  console.log("=".repeat(60));
  console.log("🛍️ ТОВАРЫ");
  console.log("=".repeat(60));
  
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    const total = row?.count || 0;
    console.log(`📊 Всего товаров: ${total}`);
    console.log("");
    
    if (total > 0) {
      db.all("SELECT id, name, price, old_price, stock, rating, is_active FROM products LIMIT 5", (err, products) => {
        console.log("📋 Последние 5 товаров:");
        products.forEach(p => {
          console.log(`  🆔 ${p.id}: ${p.name}`);
          console.log(`     💰 ${p.price} ₽${p.old_price ? ` (было ${p.old_price} ₽)` : ""}`);
          console.log(`     📦 Остаток: ${p.stock}`);
          console.log(`     ⭐ Рейтинг: ${p.rating || 0}`);
          console.log(`     ✅ Активен: ${p.is_active ? "Да" : "Нет"}`);
          console.log("");
        });
        
        if (total > 5) {
          console.log(`  ... и еще ${total - 5} товаров`);
          console.log("");
        }
      });
    } else {
      console.log("  ⚠️ Товары не найдены");
      console.log("  💡 Добавьте товары через админку");
      console.log("");
    }
    
    // 8. Проверка заказов
    checkOrders();
  });
}

// 8. Проверка заказов
function checkOrders() {
  console.log("=".repeat(60));
  console.log("📦 ЗАКАЗЫ");
  console.log("=".repeat(60));
  
  db.get("SELECT COUNT(*) as count FROM orders", (err, row) => {
    const total = row?.count || 0;
    console.log(`📊 Всего заказов: ${total}`);
    console.log("");
    
    if (total > 0) {
      db.all("SELECT id, order_number, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 3", (err, orders) => {
        orders.forEach(o => {
          console.log(`  📦 ${o.order_number}`);
          console.log(`     💰 ${o.total} ₽`);
          console.log(`     📊 Статус: ${o.status}`);
          console.log(`     📅 Создан: ${o.created_at}`);
          console.log("");
        });
      });
    } else {
      console.log("  ⚠️ Заказов пока нет");
      console.log("");
    }
    
    // 9. Проверка корзины
    checkCart();
  });
}

// 9. Проверка корзины
function checkCart() {
  console.log("=".repeat(60));
  console.log("🛒 КОРЗИНА");
  console.log("=".repeat(60));
  
  db.get("SELECT COUNT(*) as count FROM cart_items", (err, row) => {
    const total = row?.count || 0;
    console.log(`📊 Товаров в корзине: ${total}`);
    console.log("");
    
    // 10. Проверка избранного
    checkFavorites();
  });
}

// 10. Проверка избранного
function checkFavorites() {
  console.log("=".repeat(60));
  console.log("❤️ ИЗБРАННОЕ");
  console.log("=".repeat(60));
  
  db.get("SELECT COUNT(*) as count FROM favorites", (err, row) => {
    const total = row?.count || 0;
    console.log(`📊 Товаров в избранном: ${total}`);
    console.log("");
    
    // 11. Проверка отзывов
    checkReviews();
  });
}

// 11. Проверка отзывов
function checkReviews() {
  console.log("=".repeat(60));
  console.log("⭐ ОТЗЫВЫ");
  console.log("=".repeat(60));
  
  db.get("SELECT COUNT(*) as count FROM reviews", (err, row) => {
    const total = row?.count || 0;
    console.log(`📊 Всего отзывов: ${total}`);
    console.log("");
    
    if (total > 0) {
      db.all("SELECT id, rating, comment, is_approved FROM reviews LIMIT 3", (err, reviews) => {
        reviews.forEach(r => {
          console.log(`  ⭐ ${r.rating}/5`);
          console.log(`     💬 ${r.comment?.substring(0, 50) || "—"}...`);
          console.log(`     ✅ Одобрен: ${r.is_approved ? "Да" : "Нет"}`);
          console.log("");
        });
      });
    }
    
    // 12. Проверка промокодов
    checkPromoCodes();
  });
}

// 12. Проверка промокодов
function checkPromoCodes() {
  console.log("=".repeat(60));
  console.log("🎫 ПРОМОКОДЫ");
  console.log("=".repeat(60));
  
  db.all("SELECT code, description, discount_type, discount_value, is_active FROM promo_codes", (err, codes) => {
    if (err) {
      console.error("❌ Ошибка:", err);
    } else if (codes.length > 0) {
      console.log(`📊 Всего промокодов: ${codes.length}`);
      console.log("");
      codes.forEach(c => {
        console.log(`  🎫 ${c.code}`);
        console.log(`     📝 ${c.description || "—"}`);
        console.log(`     💰 ${c.discount_value}${c.discount_type === "percent" ? "%" : " ₽"}`);
        console.log(`     ✅ Активен: ${c.is_active ? "Да" : "Нет"}`);
        console.log("");
      });
    } else {
      console.log("  ⚠️ Промокоды не найдены");
      console.log("");
    }
    
    // 13. Проверка настроек
    checkSettings();
  });
}

// 13. Проверка настроек
function checkSettings() {
  console.log("=".repeat(60));
  console.log("⚙️ НАСТРОЙКИ");
  console.log("=".repeat(60));
  
  db.all("SELECT key, value, description FROM settings", (err, settings) => {
    if (err) {
      console.error("❌ Ошибка:", err);
    } else if (settings.length > 0) {
      console.log(`📊 Всего настроек: ${settings.length}`);
      console.log("");
      settings.forEach(s => {
        console.log(`  ⚙️ ${s.key} = ${s.value}`);
        console.log(`     📝 ${s.description || "—"}`);
        console.log("");
      });
    } else {
      console.log("  ⚠️ Настройки не найдены");
      console.log("");
    }
    
    // 14. ИТОГОВЫЙ ОТЧЕТ
    finalReport();
  });
}

// 14. Финальный отчет
function finalReport() {
  console.log("=".repeat(60));
  console.log("📊 ИТОГОВЫЙ ОТЧЕТ");
  console.log("=".repeat(60));
  
  // Проверяем все основные таблицы
  const tables = ["users", "categories", "products", "orders", "cart_items", "favorites", "reviews", "promo_codes", "settings"];
  let allExist = true;
  let checkTable = 0;
  
  tables.forEach((tableName) => {
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`, (err, row) => {
      checkTable++;
      if (!row) {
        console.log(`  ❌ ${tableName} - ОТСУТСТВУЕТ!`);
        allExist = false;
      }
      
      if (checkTable === tables.length) {
        console.log("");
        if (allExist) {
          console.log("✅ ВСЕ ТАБЛИЦЫ СУЩЕСТВУЮТ!");
          console.log("🎉 База данных полностью готова к работе!");
        } else {
          console.log("⚠️ Некоторые таблицы отсутствуют!");
          console.log("💡 Запустите: npm run db:update");
        }
        console.log("");
        console.log("=".repeat(60));
        db.close();
      }
    });
  });
}
