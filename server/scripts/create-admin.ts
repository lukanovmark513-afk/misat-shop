import bcrypt from 'bcryptjs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const createAdmin = async () => {
  try {
    // Открываем базу данных
    const dbPath = path.join(__dirname, '..', 'database.sqlite');

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Проверяем существование админа
    const existing = await db.get('SELECT * FROM users WHERE email = ?', ['admin@misat.com']);

    if (existing) {
      console.log('✅ Админ уже существует:');
      console.log('📧 Email:', existing.email);
      console.log('👤 Роль:', existing.role);
      await db.close();
      return;
    }

    // Сложный пароль
    const plainPassword = 'M1s@t#Adm1n$2025!Secur3P@ssw0rd';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Создаём админа
    await db.run(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'admin', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      ['admin@misat.com', hashedPassword, 'Admin', 'MISAT', '+7 (999) 123-45-67']
    );

    console.log('✅ Админ успешно создан!');
    console.log('📧 Email: admin@misat.com');
    console.log(`🔑 Пароль: ${plainPassword}`);

    await db.close();

  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
};

createAdmin();