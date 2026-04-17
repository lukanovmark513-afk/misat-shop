import { Request, Response } from 'express';
import { getDb } from '../config/database';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const categories = await db.all('SELECT * FROM categories WHERE is_active = 1 ORDER BY name');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Ошибка получения категорий' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug } = req.body;
    const db = await getDb();

    const result = await db.run(
      `INSERT INTO categories (name, slug, is_active, created_at, updated_at)
       VALUES (?, ?, 1, datetime('now'), datetime('now'))`,
      [name, slug]
    );

    const newCategory = await db.get('SELECT * FROM categories WHERE id = ?', [result.lastID]);
    res.json(newCategory);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Ошибка создания категории' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, is_active } = req.body;
    const db = await getDb();

    await db.run(
      `UPDATE categories SET name = ?, slug = ?, is_active = ?, updated_at = datetime('now') WHERE id = ?`,
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