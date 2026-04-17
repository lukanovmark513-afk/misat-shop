// server/src/controllers/adminController.ts
import { Request, Response } from 'express';
import { getDb } from '../config/database';

// Дашборд
export const getDashboard = async (req: Request, res: Response) => {
  try {
    const db = await getDb();

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
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Ошибка получения статистики' });
  }
};

// Товары
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const products = await db.all('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения товаров' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, old_price, description, category, sizes, colors, stock, is_new, is_sale, image } = req.body;
    const db = await getDb();

    const result = await db.run(
      `INSERT INTO products (name, price, old_price, description, category, sizes, colors, stock, is_new, is_sale, image, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [name, price, old_price, description, category, JSON.stringify(sizes), JSON.stringify(colors), stock, is_new || 0, is_sale || 0, image]
    );

    const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
    res.json(newProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Ошибка создания товара' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const db = await getDb();

    await db.run(
      `UPDATE products SET name = ?, price = ?, old_price = ?, description = ?, category = ?, sizes = ?, colors = ?, stock = ?, is_new = ?, is_sale = ?, image = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [updates.name, updates.price, updates.old_price, updates.description, updates.category,
       JSON.stringify(updates.sizes), JSON.stringify(updates.colors), updates.stock,
       updates.is_new || 0, updates.is_sale || 0, updates.image, id]
    );

    const updated = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления товара' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.run('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Товар удалён' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления товара' });
  }
};

// Заказы
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const orders = await db.all('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения заказов' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = await getDb();
    await db.run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
    res.json({ message: 'Статус обновлён' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления статуса' });
  }
};

// Пользователи
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const users = await db.all('SELECT id, email, first_name, last_name, phone, role, created_at FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения пользователей' });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const db = await getDb();
    await db.run('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [role, id]);
    res.json({ message: 'Роль обновлена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления роли' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'Пользователь удалён' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления пользователя' });
  }
};

// Категории
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const categories = await db.all('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения категорий' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug } = req.body;
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO categories (name, slug, is_active, created_at, updated_at) VALUES (?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      [name, slug]
    );
    const newCategory = await db.get('SELECT * FROM categories WHERE id = ?', [result.lastID]);
    res.json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания категории' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, is_active } = req.body;
    const db = await getDb();
    await db.run(
      'UPDATE categories SET name = ?, slug = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, slug, is_active, id]
    );
    res.json({ message: 'Категория обновлена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления категории' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.run('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Категория удалена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления категории' });
  }
};

// Аналитика
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
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
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения аналитики' });
  }
};

export const exportAnalytics = async (req: Request, res: Response) => {
  res.json({ message: 'Экспорт аналитики' });
};