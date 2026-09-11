const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

(async () => {
  try {
    const db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

    console.log('Database opened');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        phone TEXT,
        balance INTEGER DEFAULT 0,
        role TEXT DEFAULT 'user',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Table users created!');

    const info = await db.all('PRAGMA table_info(users)');
    console.log('Table structure:');
    console.table(info);

    await db.close();
    console.log('Done!');

  } catch (error) {
    console.error('Error:', error.message);
  }
})();