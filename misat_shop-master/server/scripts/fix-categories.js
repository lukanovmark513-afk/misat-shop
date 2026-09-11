const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../database.sqlite");
const db = new sqlite3.Database(dbPath);

console.log("🔧 Исправление таблицы categories...");

// Проверяем, есть ли колонка sort_order
db.get("PRAGMA table_info(categories)", (err, columns) => {
  if (err) {
    console.error("❌ Ошибка:", err);
    db.close();
    return;
  }
  
  // Проверяем все колонки
  db.all("PRAGMA table_info(categories)", (err, columns) => {
    if (err) {
      console.error("❌ Ошибка:", err);
      db.close();
      return;
    }
    
    const hasSortOrder = columns.some(col => col.name === "sort_order");
    
    if (hasSortOrder) {
      console.log("✅ Колонка sort_order уже существует");
      db.close();
      return;
    }
    
    console.log("📝 Добавляем колонку sort_order...");
    
    db.run("ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0", function(err) {
      if (err) {
        console.error("❌ Ошибка:", err);
      } else {
        console.log("✅ Колонка sort_order добавлена!");
      }
      
      // Проверяем другие возможные отсутствующие колонки
      checkOtherColumns(db);
    });
  });
});

function checkOtherColumns(db) {
  console.log("\n🔍 Проверка других колонок...");
  
  // Проверяем колонки в таблице products
  db.all("PRAGMA table_info(products)", (err, columns) => {
    if (err) {
      console.error("❌ Ошибка:", err);
      db.close();
      return;
    }
    
    const columnNames = columns.map(c => c.name);
    const neededColumns = [
      { name: "slug", type: "TEXT" },
      { name: "brand", type: "TEXT" },
      { name: "short_description", type: "TEXT" },
      { name: "materials", type: "TEXT" },
      { name: "care_instructions", type: "TEXT" },
      { name: "reserved_stock", type: "INTEGER DEFAULT 0" },
      { name: "is_bestseller", type: "INTEGER DEFAULT 0" },
      { name: "meta_title", type: "TEXT" },
      { name: "meta_description", type: "TEXT" },
      { name: "meta_keywords", type: "TEXT" },
      { name: "views_count", type: "INTEGER DEFAULT 0" },
      { name: "sales_count", type: "INTEGER DEFAULT 0" }
    ];
    
    let added = 0;
    neededColumns.forEach(col => {
      if (!columnNames.includes(col.name)) {
        console.log(`  📝 Добавляем колонку: ${col.name}`);
        db.run(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type}`, (err) => {
          if (err) {
            console.log(`    ⚠️ ${err.message}`);
          } else {
            added++;
            console.log(`    ✅ ${col.name} добавлена`);
          }
        });
      }
    });
    
    if (added === 0) {
      console.log("✅ Все колонки уже существуют");
    }
    
    setTimeout(() => {
      checkUsersTable(db);
    }, 1000);
  });
}

function checkUsersTable(db) {
  console.log("\n🔍 Проверка таблицы users...");
  
  db.all("PRAGMA table_info(users)", (err, columns) => {
    if (err) {
      console.error("❌ Ошибка:", err);
      db.close();
      return;
    }
    
    const columnNames = columns.map(c => c.name);
    const neededColumns = [
      { name: "avatar", type: "TEXT" },
      { name: "email_verified", type: "INTEGER DEFAULT 0" },
      { name: "reset_token", type: "TEXT" },
      { name: "reset_token_expires", type: "DATETIME" },
      { name: "last_login", type: "DATETIME" }
    ];
    
    let added = 0;
    neededColumns.forEach(col => {
      if (!columnNames.includes(col.name)) {
        console.log(`  📝 Добавляем колонку: ${col.name}`);
        db.run(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`, (err) => {
          if (err) {
            console.log(`    ⚠️ ${err.message}`);
          } else {
            added++;
            console.log(`    ✅ ${col.name} добавлена`);
          }
        });
      }
    });
    
    if (added === 0) {
      console.log("✅ Все колонки уже существуют");
    }
    
    setTimeout(() => {
      console.log("\n✅ Готово!");
      showSummary(db);
    }, 1000);
  });
}

function showSummary(db) {
  console.log("\n" + "=".repeat(50));
  console.log("📊 ИТОГ");
  console.log("=".repeat(50));
  
  db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, tables) => {
    console.log(`📋 Таблицы (${tables.length} шт.):`);
    tables.forEach(t => {
      db.get(`SELECT COUNT(*) as count FROM ${t.name}`, (err, row) => {
        console.log(`  ✅ ${t.name}: ${row?.count || 0} записей`);
      });
    });
    
    setTimeout(() => {
      db.close();
      console.log("\n🎉 База данных готова!");
      console.log("👤 Админ: admin@misat.com / admin123");
    }, 500);
  });
}
