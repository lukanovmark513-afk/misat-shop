import { Request, Response } from 'express';
import { getDb } from '../config/database';

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const db = await getDb();

    const cart = await db.all(
      `SELECT ci.*, p.name, p.price, p.image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [userId]
    );

    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId, quantity, size } = req.body;
    const db = await getDb();

    const existing = await db.get(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND size = ?',
      [userId, productId, size]
    );

    if (existing) {
      await db.run(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing.id]
      );
    } else {
      await db.run(
        'INSERT INTO cart_items (user_id, product_id, quantity, size) VALUES (?, ?, ?, ?)',
        [userId, productId, quantity, size]
      );
    }

    const cart = await db.all(
      `SELECT ci.*, p.name, p.price, p.image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [userId]
    );

    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;
    const db = await getDb();

    await db.run(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, itemId, userId]
    );

    const cart = await db.all(
      `SELECT ci.*, p.name, p.price, p.image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [userId]
    );

    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { itemId } = req.params;
    const db = await getDb();

    await db.run('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [itemId, userId]);

    const cart = await db.all(
      `SELECT ci.*, p.name, p.price, p.image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [userId]
    );

    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const db = await getDb();

    await db.run('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    res.json([]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};