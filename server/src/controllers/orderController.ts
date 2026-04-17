// server/src/controllers/orderController.ts
import { Request, Response } from 'express';
import { getDb } from '../config/database';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, total, address, phone, comment } = req.body;
    const userId = (req as any).user.id;
    const db = await getDb();

    const orderId = `MISAT-${Date.now()}`;

    await db.run(
      `INSERT INTO orders (id, user_id, order_number, status, total, delivery_address, phone, comment, created_at, updated_at)
       VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [Date.now(), userId, orderId, total, address, phone, comment]
    );

    res.json({ message: 'Заказ создан', orderId });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Ошибка создания заказа' });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const db = await getDb();
    const orders = await db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения заказов' });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const orders = await db.all('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения заказов' });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения заказа' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = await getDb();
    await db.run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
    res.json({ message: 'Статус заказа обновлён' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления статуса' });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.run('UPDATE orders SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
    res.json({ message: 'Заказ отменён' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка отмены заказа' });
  }
};