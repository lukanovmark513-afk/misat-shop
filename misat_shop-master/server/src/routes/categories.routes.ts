import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';

const router = Router();

// Получить все категории
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const categories = await db.all('SELECT * FROM categories WHERE is_active = 1 ORDER BY name');
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить категорию по ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const category = await db.get('SELECT * FROM categories WHERE id = ?', [id]);
    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Создать категорию
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, slug, description } = req.body;
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [name, slug || name.toLowerCase().replace(/\s/g, '-'), description || '']
    );
    res.status(201).json({ id: result.lastID, message: 'Категория создана' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ ОБНОВИТЬ категорию
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, is_active } = req.body;
    const db = await getDb();
    await db.run(
      'UPDATE categories SET name = ?, slug = ?, description = ?, is_active = ? WHERE id = ?',
      [name, slug, description || '', is_active !== undefined ? is_active : 1, id]
    );
    res.json({ message: 'Категория обновлена' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ УДАЛИТЬ категорию
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const result = await db.run('DELETE FROM categories WHERE id = ?', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    res.json({ message: 'Категория удалена' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
