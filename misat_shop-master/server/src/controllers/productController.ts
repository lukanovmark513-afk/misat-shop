import { Request, Response } from 'express';
import { getDb } from '../config/database';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const products = await db.all('SELECT * FROM products ORDER BY id DESC');

    console.log(`📦 Загружено товаров: ${products.length}`);

    res.json(products);
  } catch (error: any) {
    console.error('❌ Ошибка загрузки товаров:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);

    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    res.json(product);
  } catch (error: any) {
    console.error('❌ Ошибка загрузки товара:', error);
    res.status(500).json({ error: error.message });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      old_price,
      category,
      description,
      stock,
      image,
      images,
      sizes,
      colors,
      is_new,
      is_sale,
      stockType,
      preorderDays,
      prepaymentPercent
    } = req.body;

    const db = await getDb();

    const result = await db.run(`
      INSERT INTO products (
        name, price, old_price, category, description, stock, image,
        images, sizes, colors, is_new, is_sale, stockType, preorderDays,
        prepaymentPercent, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `, [
      name,
      price,
      old_price || null,
      category || '',
      description || '',
      stock || 0,
      image || '',
      images || '[]',
      sizes || '[]',
      colors || '[]',
      is_new || 0,
      is_sale || 0,
      stockType || 'in_stock',
      preorderDays || null,
      prepaymentPercent || 70
    ]);

    const product = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);

    console.log(`✅ Добавлен товар: ${name}`);
    res.status(201).json(product);
  } catch (error: any) {
    console.error('❌ Ошибка добавления товара:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const db = await getDb();

    // Проверяем существование товара
    const existing = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    // Собираем поля для обновления
    const allowedFields = [
      'name', 'price', 'old_price', 'category', 'description',
      'stock', 'image', 'images', 'sizes', 'colors',
      'is_new', 'is_sale', 'stockType', 'preorderDays', 'prepaymentPercent'
    ];

    const fieldsToUpdate = Object.keys(updates).filter(key => allowedFields.includes(key));

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: 'Нет полей для обновления' });
    }

    const setClause = fieldsToUpdate.map(key => `${key} = ?`).join(', ');
    const values = fieldsToUpdate.map(key => updates[key]);
    values.push(id);

    await db.run(`UPDATE products SET ${setClause}, updated_at = datetime('now') WHERE id = ?`, values);

    const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);

    console.log(`✅ Обновлен товар: ${product.name}`);
    res.json(product);
  } catch (error: any) {
    console.error('❌ Ошибка обновления товара:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();

    // Проверяем существование
    const existing = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    await db.run('DELETE FROM products WHERE id = ?', [id]);

    console.log(`🗑️ Удален товар: ${existing.name}`);
    res.json({ message: 'Товар удален' });
  } catch (error: any) {
    console.error('❌ Ошибка удаления товара:', error);
    res.status(500).json({ error: error.message });
  }
};

// Дополнительные функции

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const db = await getDb();
    const products = await db.all(
      'SELECT * FROM products WHERE category = ? AND is_active = 1 ORDER BY id DESC',
      [category]
    );
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getNewProducts = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const products = await db.all(
      'SELECT * FROM products WHERE is_new = 1 AND is_active = 1 ORDER BY id DESC LIMIT 10'
    );
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSaleProducts = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const products = await db.all(
      'SELECT * FROM products WHERE is_sale = 1 AND is_active = 1 ORDER BY id DESC LIMIT 10'
    );
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};