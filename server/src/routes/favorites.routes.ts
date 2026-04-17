import { Router } from 'express';
import { getFavorites, toggleFavorite } from '../controllers/favoritesController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getFavorites);
router.post('/:productId', authMiddleware, toggleFavorite);

export default router;