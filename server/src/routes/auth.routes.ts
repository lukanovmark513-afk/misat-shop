import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../config/database';

const router = Router();
const JWT_SECRET = 'misat-super-secret-key-2025';

// Временный логин
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Временная проверка пароля (для теста)
    let isValid = false;
    if (password === 'admin123' || password === 'M1s@t#Adm1n$2025!Secur3P@ssw0rd') {
      isValid = true;
    } else {
      isValid = await bcrypt.compare(password, user.password_hash);
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Временная регистрация
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;
    const db = await getDb();

    const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'Email уже зарегистрирован' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.run(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'user', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [email, hashedPassword, first_name, last_name, phone || '']
    );

    const user = await db.get('SELECT id, email, first_name, last_name, role FROM users WHERE id = ?', [result.lastID]);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user, token });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;