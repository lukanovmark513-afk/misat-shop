"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportAnalytics = exports.getAnalytics = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getAllCategories = exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.updateOrderStatus = exports.getAllOrders = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getAllProducts = exports.getDashboard = void 0;
const database_1 = require("../config/database");
// Дашборд
const getDashboard = async (req, res) => {
    try {
        const db = await (0, database_1.getDb)();
        const totalProducts = await db.get('SELECT COUNT(*) as count FROM products');
        const totalOrders = await db.get('SELECT COUNT(*) as count FROM orders');
        const totalUsers = await db.get('SELECT COUNT(*) as count FROM users');
        const totalRevenue = await db.get('SELECT SUM(total) as sum FROM orders WHERE status != "cancelled"');
        const pendingOrders = await db.get('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');
        res.json({
            totalProducts: totalProducts?.count || 0,
            totalOrders: totalOrders?.count || 0,
            totalUsers: totalUsers?.count || 0,
            totalRevenue: totalRevenue?.sum || 0,
            pendingOrders: pendingOrders?.count || 0,
        });
    }
    catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Ошибка получения статистики' });
    }
};
exports.getDashboard = getDashboard;
// Товары
const getAllProducts = async (req, res) => {
    try {
        const db = await (0, database_1.getDb)();
        const products = await db.all('SELECT * FROM products ORDER BY created_at DESC');
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка получения товаров' });
    }
};
exports.getAllProducts = getAllProducts;
const createProduct = async (req, res) => {
    try {
        const { name, price, old_price, description, category, sizes, colors, stock, is_new, is_sale, image } = req.body;
        const db = await (0, database_1.getDb)();
        const result = await db.run(`INSERT INTO products (name, price, old_price, description, category, sizes, colors, stock, is_new, is_sale, image, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`, [name, price, old_price, description, category, JSON.stringify(sizes), JSON.stringify(colors), stock, is_new || 0, is_sale || 0, image]);
        const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
        res.json(newProduct);
    }
    catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Ошибка создания товара' });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const db = await (0, database_1.getDb)();
        await db.run(`UPDATE products SET name = ?, price = ?, old_price = ?, description = ?, category = ?, sizes = ?, colors = ?, stock = ?, is_new = ?, is_sale = ?, image = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`, [updates.name, updates.price, updates.old_price, updates.description, updates.category,
            JSON.stringify(updates.sizes), JSON.stringify(updates.colors), updates.stock,
            updates.is_new || 0, updates.is_sale || 0, updates.image, id]);
        const updated = await db.get('SELECT * FROM products WHERE id = ?', [id]);
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка обновления товара' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await (0, database_1.getDb)();
        await db.run('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Товар удалён' });
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка удаления товара' });
    }
};
exports.deleteProduct = deleteProduct;
// Заказы
const getAllOrders = async (req, res) => {
    try {
        const db = await (0, database_1.getDb)();
        const orders = await db.all('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка получения заказов' });
    }
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const db = await (0, database_1.getDb)();
        await db.run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
        res.json({ message: 'Статус обновлён' });
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка обновления статуса' });
    }
};
exports.updateOrderStatus = updateOrderStatus;
// Пользователи
const getAllUsers = async (req, res) => {
    try {
        const db = await (0, database_1.getDb)();
        const users = await db.all('SELECT id, email, first_name, last_name, phone, role, created_at FROM users');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка получения пользователей' });
    }
};
exports.getAllUsers = getAllUsers;
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const db = await (0, database_1.getDb)();
        await db.run('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [role, id]);
        res.json({ message: 'Роль обновлена' });
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка обновления роли' });
    }
};
exports.updateUserRole = updateUserRole;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await (0, database_1.getDb)();
        await db.run('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'Пользователь удалён' });
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка удаления пользователя' });
    }
};
exports.deleteUser = deleteUser;
// Категории
const getAllCategories = async (req, res) => {
    try {
        const db = await (0, database_1.getDb)();
        const categories = await db.all('SELECT * FROM categories ORDER BY name');
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка получения категорий' });
    }
};
exports.getAllCategories = getAllCategories;
const createCategory = async (req, res) => {
    try {
        const { name, slug } = req.body;
        const db = await (0, database_1.getDb)();
        const result = await db.run('INSERT INTO categories (name, slug, is_active, created_at, updated_at) VALUES (?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)', [name, slug]);
        const newCategory = await db.get('SELECT * FROM categories WHERE id = ?', [result.lastID]);
        res.json(newCategory);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка создания категории' });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, is_active } = req.body;
        const db = await (0, database_1.getDb)();
        await db.run('UPDATE categories SET name = ?, slug = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [name, slug, is_active, id]);
        res.json({ message: 'Категория обновлена' });
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка обновления категории' });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await (0, database_1.getDb)();
        await db.run('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Категория удалена' });
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка удаления категории' });
    }
};
exports.deleteCategory = deleteCategory;
// Аналитика
const getAnalytics = async (req, res) => {
    try {
        const db = await (0, database_1.getDb)();
        const analytics = await db.all(`
      SELECT
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM orders
      WHERE status != 'cancelled'
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC
      LIMIT 6
    `);
        res.json(analytics);
    }
    catch (error) {
        res.status(500).json({ error: 'Ошибка получения аналитики' });
    }
};
exports.getAnalytics = getAnalytics;
const exportAnalytics = async (req, res) => {
    res.json({ message: 'Экспорт аналитики' });
};
exports.exportAnalytics = exportAnalytics;
