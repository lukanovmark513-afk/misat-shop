import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import * as categoryController from '../controllers/categoryController';

const router = Router();

// Публичные маршруты (для всех)
router.get('/', categoryController.getAllCategories);

// Админские маршруты (требуют авторизацию)
router.post('/', authMiddleware, adminMiddleware, categoryController.createCategory);
router.put('/:id', authMiddleware, adminMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.deleteCategory);

export default router;