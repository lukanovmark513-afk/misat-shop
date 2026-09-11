import { Request, Response } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.json([]);
    
    const db = await require('../config/database').getDb();
    const cart = await db.all(
      'SELECT * FROM cart_items WHERE user_id = ?',
      [userId]
    );
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Не авторизован' });
    
    const { productId, quantity, size } = req.body;
    const db = await require('../config/database').getDb();
    
    await db.run(
      'INSERT INTO cart_items (user_id, product_id, quantity, size) VALUES (?, ?, ?, ?)',
      [userId, productId, quantity || 1, size || '']
    );
    res.json({ message: 'Добавлено в корзину' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const db = await require('../config/database').getDb();
    await db.run('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [id, userId]);
    res.json({ message: 'Удалено из корзины' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { quantity } = req.body;
    
    const db = await require('../config/database').getDb();
    await db.run('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, id, userId]);
    res.json({ message: 'Корзина обновлена' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const db = await require('../config/database').getDb();
    await db.run('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    res.json({ message: 'Корзина очищена' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
