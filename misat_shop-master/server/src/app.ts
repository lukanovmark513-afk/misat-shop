import express from 'express';
import cors from 'cors';
import productsRoutes from './routes/products.routes';
import brandsRoutes from './routes/brands.routes';
import categoriesRoutes from './routes/categories.routes';
import authRoutes from './routes/auth.routes';
import favoritesRoutes from './routes/favorites.routes';
import ordersRoutes from './routes/orders.routes';
import formsRoutes from './routes/forms.routes';
import cdekRoutes from './routes/cdek.routes';
import { getDb } from './database';

const app = express();
const PORT = 5000;

// Увеличиваем лимит
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============================================
// CORS — РАЗРЕШАЕМ ВСЕ ДЛЯ ТЕСТА
// ============================================
app.use(cors({
  origin: '*', // 👈 ВРЕМЕННО РАЗРЕШАЕМ ВСЕ
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Подключаем БД
app.use(async (req, res, next) => {
  await getDb();
  next();
});

// Маршруты
app.use('/api/products', productsRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/cdek', cdekRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    services: {
      database: 'connected',
      cdek: 'available',
    }
  });
});

// Запуск на всех интерфейсах
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен: http://0.0.0.0:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`📱 Для телефона: http://192.168.0.36:${PORT}`);
});

export default app;