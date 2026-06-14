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
      middle_name TEXT,
      phone TEXT,
      role TEXT DEFAULT 'user',
      balance REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      image TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      old_price REAL,
      image TEXT,
      images TEXT,
      description TEXT,
      category TEXT,
      sizes TEXT,
      colors TEXT,
      rating REAL DEFAULT 0,
      is_new INTEGER DEFAULT 0,
      is_sale INTEGER DEFAULT 0,
      stock INTEGER DEFAULT 0,
      stockType TEXT DEFAULT 'in_stock',
      preorderDays INTEGER,
      prepaymentPercent INTEGER DEFAULT 100,
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

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      product_name TEXT,
      product_price REAL,
      quantity INTEGER,
      size TEXT,
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

  // МИГРАЦИЯ: добавляем колонку image в categories если её нет
  try {
    await dbInstance.exec(`ALTER TABLE categories ADD COLUMN image TEXT`);
    console.log('✅ Добавлена колонка image в таблицу categories');
  } catch (err: any) {
    if (!err.message?.includes('duplicate column name')) {
      console.log('⚠️ Колонка image уже существует или ошибка:', err.message);
    }
  }

  // МИГРАЦИЯ: добавляем колонку updated_at в categories если её нет
  try {
    await dbInstance.exec(`ALTER TABLE categories ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`);
    console.log('✅ Добавлена колонка updated_at в таблицу categories');
  } catch (err: any) {
    if (!err.message?.includes('duplicate column name')) {
      console.log('⚠️ Колонка updated_at уже существует или ошибка:', err.message);
    }
  }

  // ИСПРАВЛЕНИЕ КАТЕГОРИЙ В ТОВАРАХ (русские названия → английские slug)
  try {
    await dbInstance.exec(`
      UPDATE products SET category = 'clothes' WHERE category = 'Одежда';
      UPDATE products SET category = 'shoes' WHERE category = 'Обувь';
      UPDATE products SET category = 'accessories' WHERE category = 'Аксессуары';
      UPDATE products SET category = 'sport' WHERE category = 'Спорт';
    `);
    console.log('✅ Категории товаров обновлены (Одежда→clothes и т.д.)');
  } catch (err: any) {
    if (!err.message?.includes('no such column')) {
      console.log('⚠️ Ошибка обновления категорий:', err.message);
    }
  }

  // Добавляем админа если нет
  const admin = await dbInstance.get('SELECT * FROM users WHERE email = ?', ['admin@misat.com']);
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await dbInstance.run(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, balance) VALUES (?, ?, ?, ?, ?, ?)`,
      ['admin@misat.com', hashedPassword, 'Admin', 'MISAT', 'admin', 0]
    );
    console.log('✅ Админ создан: admin@misat.com / admin123');
  }

  // Добавляем тестовые категории если нет
  const categoriesCount = await dbInstance.get('SELECT COUNT(*) as count FROM categories');
  if (!categoriesCount || categoriesCount.count === 0) {
    const testCategories = [
      { name: 'Одежда', slug: 'clothes' },
      { name: 'Обувь', slug: 'shoes' },
      { name: 'Аксессуары', slug: 'accessories' },
      { name: 'Спорт', slug: 'sport' },
    ];

    for (const cat of testCategories) {
      await dbInstance.run(
        'INSERT INTO categories (name, slug, is_active, created_at, updated_at) VALUES (?, ?, 1, datetime("now"), datetime("now"))',
        [cat.name, cat.slug]
      );
    }
    console.log('✅ Добавлены тестовые категории');
  }

  return dbInstance;
};