// server/src/routes/orders.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import * as orderController from '../controllers/orderController';

const router = Router();

router.use(authMiddleware);

router.post('/', orderController.createOrder);
router.get('/my', orderController.getMyOrders);
router.get('/admin', adminMiddleware, orderController.getAllOrders);
router.get('/:id', orderController.getOrderDetails);
router.put('/:id/status', adminMiddleware, orderController.updateOrderStatus);
router.put('/:id/cancel', orderController.cancelOrder);

export default router;