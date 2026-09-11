import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';

const router = Router();

// Получить все бренды
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const brands = await db.all('SELECT * FROM brands WHERE is_active = 1 ORDER BY name');
    res.json(brands);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Создать бренд
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, slug, description } = req.body;
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO brands (name, slug, description) VALUES (?, ?, ?)',
      [name, slug || name.toLowerCase().replace(/\s+/g, '-'), description || '']
    );
    res.status(201).json({ id: result.lastID, message: 'Бренд создан' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить бренд
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, is_active } = req.body;
    const db = await getDb();
    await db.run(
      'UPDATE brands SET name = ?, slug = ?, description = ?, is_active = ? WHERE id = ?',
      [name, slug, description, is_active, id]
    );
    res.json({ message: 'Бренд обновлён' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Удалить бренд
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.run('DELETE FROM brands WHERE id = ?', [id]);
    res.json({ message: 'Бренд удалён' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
