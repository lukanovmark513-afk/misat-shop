import { Request, Response } from 'express';
import { getDb } from '../config/database';

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const db = await getDb();

    const favorites = await db.all(
      'SELECT product_id FROM favorites WHERE user_id = ?',
      [userId]
    );

    res.json(favorites.map((f: any) => f.product_id));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId } = req.params;
    const db = await getDb();

    const existing = await db.get(
      'SELECT * FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    let isFavorite = false;

    if (existing) {
      await db.run('DELETE FROM favorites WHERE user_id = ? AND product_id = ?', [userId, productId]);
      isFavorite = false;
    } else {
      await db.run('INSERT INTO favorites (user_id, product_id) VALUES (?, ?)', [userId, productId]);
      isFavorite = true;
    }

    res.json({ isFavorite });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};