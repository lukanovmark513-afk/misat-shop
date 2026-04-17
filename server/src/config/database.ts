import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';

let dbInstance: any = null;

export const getDb = async () => {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Создаём таблицы
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      old_price REAL,
      image TEXT,
      description TEXT,
      category TEXT,
      sizes TEXT,
      colors TEXT,
      rating REAL DEFAULT 0,
      is_new INTEGER DEFAULT 0,
      is_sale INTEGER DEFAULT 0,
      stock INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      product_id INTEGER,
      quantity INTEGER DEFAULT 1,
      size TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE,
      user_id INTEGER,
      total REAL,
      status TEXT DEFAULT 'pending',
      address TEXT,
      phone TEXT,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      user_id INTEGER,
      rating INTEGER,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Добавляем админа если нет
  const admin = await dbInstance.get('SELECT * FROM users WHERE email = ?', ['admin@misat.com']);
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await dbInstance.run(
      `INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)`,
      ['admin@misat.com', hashedPassword, 'Admin', 'MISAT', 'admin']
    );
    console.log('✅ Админ создан: admin@misat.com / admin123');
  }

  return dbInstance;
};