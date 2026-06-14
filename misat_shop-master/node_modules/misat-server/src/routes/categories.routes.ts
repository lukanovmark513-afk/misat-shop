import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import * as categoryController from '../controllers/categoryController';

const router = Router();

// Публичные маршруты
router.get('/', categoryController.getAllCategories);
router.get('/active', categoryController.getActiveCategories);

// Админские маршруты
router.post('/', authMiddleware, adminMiddleware, categoryController.createCategory);
router.put('/:id', authMiddleware, adminMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.deleteCategory);

export default router;