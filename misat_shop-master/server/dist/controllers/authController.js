"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const JWT_SECRET = process.env.JWT_SECRET || 'misat-super-secret-key-2025';
const register = async (req, res) => {
    try {
        const { email, password, first_name, last_name, phone } = req.body;
        const db = await (0, database_1.getDb)();
        // Проверка существующего пользователя
        const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existing) {
            return res.status(400).json({ error: 'Email уже зарегистрирован' });
        }
        // Хеширование пароля
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Создание пользователя
        const result = await db.run(`INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
       VALUES (?, ?, ?, ?, ?, 'user')`, [email, hashedPassword, first_name, last_name, phone]);
        // Получение созданного пользователя
        const user = await db.get('SELECT id, email, first_name, last_name, role FROM users WHERE id = ?', [result.lastID]);
        // Создание JWT токена
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ user, token });
    }
    catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = await (0, database_1.getDb)();
        // Поиск пользователя
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        // Проверка пароля
        const isValid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        // Создание JWT токена
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        const { password_hash, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    }
};
exports.login = login;
