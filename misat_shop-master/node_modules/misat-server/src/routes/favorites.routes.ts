import { Router } from 'express';
import { getFavorites, addToFavorites, removeFromFavorites, toggleFavorite } from '../controllers/favoritesController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Все маршруты требуют авторизации
router.use(authMiddleware);

// Получить все избранные товары
router.get('/', getFavorites);

// Добавить в избранное (через POST с productId в body)
router.post('/', addToFavorites);

// Удалить из избранного (через DELETE с productId в params)
router.delete('/:productId', removeFromFavorites);

// Переключить избранное (добавить/удалить)
router.post('/toggle/:productId', toggleFavorite);

export default router;