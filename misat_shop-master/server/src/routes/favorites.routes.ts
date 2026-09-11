import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';
import { authMiddleware } from '../middleware/authMiddleware';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

const router = Router();

router.use(authMiddleware);

// Получить избранное пользователя
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.json([]);
    
    const db = await getDb();
    const favorites: any[] = await db.all('SELECT product_id FROM favorites WHERE user_id = ?', [userId]);
    res.json(favorites.map((f: any) => f.product_id));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Переключить избранное
router.post('/toggle/:productId', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Не авторизован' });
    
    const { productId } = req.params;
    const db = await getDb();
    
    const existing = await db.get('SELECT id FROM favorites WHERE user_id = ? AND product_id = ?', [userId, productId]);
    
    if (existing) {
      await db.run('DELETE FROM favorites WHERE user_id = ? AND product_id = ?', [userId, productId]);
      res.json({ productId: parseInt(productId), isFavorite: false });
    } else {
      await db.run('INSERT INTO favorites (user_id, product_id) VALUES (?, ?)', [userId, productId]);
      res.json({ productId: parseInt(productId), isFavorite: true });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
