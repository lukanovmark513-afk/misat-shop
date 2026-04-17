import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import cartRoutes from './routes/cart.routes';
import favoritesRoutes from './routes/favorites.routes';
import adminRoutes from './routes/admin.routes';
import categoriesRoutes from './routes/categories.routes';
import ordersRoutes from './routes/orders.routes';
import formsRoutes from './routes/forms.routes';  // ← ДОБАВИТЬ
import { getDb } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS настройки
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://192.168.0.21:5173'],
  credentials: true
}));

// Увеличиваем лимит для загрузки фото (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const db = await getDb();
    await db.get('SELECT 1');
    res.json({ status: 'ok', message: 'MISAT API работает', database: 'connected' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: 'Ошибка БД', error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/forms', formsRoutes);  // ← ДОБАВИТЬ

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Admin panel: http://localhost:${PORT}/api/admin`);
});