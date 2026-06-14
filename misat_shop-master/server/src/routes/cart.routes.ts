import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getCart);
router.post('/items', authMiddleware, addToCart);
router.put('/items/:itemId', authMiddleware, updateCartItem);
router.delete('/items/:itemId', authMiddleware, removeFromCart);
router.delete('/clear', authMiddleware, clearCart);

export default router;