import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../config/database';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'misat_secret_key_2024';

// ============================================
// POST /api/auth/register
// ============================================
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    console.log('📥 Регистрация:', { email, firstName, lastName, phone });

    // Проверка обязательных полей
    if (!email || !password) {
      console.log('❌ Нет email или пароля');
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const db = await getDb();

    // Проверка существующего пользователя
    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) {
      console.log('❌ Пользователь уже существует:', email);
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Вставка пользователя
    const result = await db.run(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, balance, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        email.toLowerCase(),
        hashedPassword,
        firstName || '',
        lastName || '',
        phone || '',
        0,
        'user',
        new Date().toISOString()
      ]
    );

    console.log('✅ Пользователь создан, ID:', result.lastID);

    // Получаем созданного пользователя
    const user = await db.get(
      'SELECT id, email, first_name, last_name, phone, balance, role FROM users WHERE id = ?',
      [result.lastID]
    );

    // Генерация токена
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        balance: user.balance,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error('❌ Ошибка регистрации:', error);
    res.status(500).json({ error: error.message || 'Ошибка регистрации' });
  }
});

// ============================================
// POST /api/auth/login
// ============================================
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log('📥 Вход:', { email });

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const db = await getDb();

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user) {
      console.log('❌ Пользователь не найден:', email);
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      console.log('❌ Неверный пароль для:', email);
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Вход выполнен:', email);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        balance: user.balance,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error('❌ Ошибка входа:', error);
    res.status(500).json({ error: error.message || 'Ошибка входа' });
  }
});

export default router;