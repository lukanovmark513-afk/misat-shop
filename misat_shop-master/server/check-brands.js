const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function checkBrands() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
  
  // Проверяем существование таблицы
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('📋 Таблицы в БД:', tables.map(t => t.name));
  
  // Проверяем бренды
  try {
    const brands = await db.all('SELECT * FROM brands');
    console.log('📋 Бренды в БД:', brands);
  } catch (e) {
    console.log('❌ Таблица brands не существует');
    console.log('Создаём таблицу brands...');
    
    await db.exec(`
      CREATE TABLE brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE,
        description TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Таблица brands создана');
    
    // Добавляем тестовые бренды
    const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok', 'Gucci'];
    for (const brand of brands) {
      await db.run('INSERT OR IGNORE INTO brands (name, slug) VALUES (?, ?)', 
        [brand, brand.toLowerCase().replace(/\s+/g, '-')]);
    }
    console.log('✅ Тестовые бренды добавлены');
    
    const result = await db.all('SELECT * FROM brands');
    console.log('📋 Бренды после создания:', result);
  }
  
  await db.close();
}

checkBrands();
