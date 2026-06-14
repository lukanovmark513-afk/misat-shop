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
import formsRoutes from './routes/forms.routes';
import { getDb } from './database';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// CORS настройки
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://192.168.0.27:5173',
  'http://192.168.0.27:5174',
  /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => o === origin || (o instanceof RegExp && o.test(origin)))) {
      callback(null, true);
    } else {
      console.log('❌ Блокирован CORS запрос с:', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Увеличиваем лимит для загрузки фото (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Логирование запросов
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

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
app.use('/api/forms', formsRoutes);

// Запуск на всех интерфейсах
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Сервер запущен:`);
  console.log(`   📍 http://localhost:${PORT}`);

  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  console.log(`\n📡 Доступен в сети по IP:`);
  for (const interfaceName in networkInterfaces) {
    for (const iface of networkInterfaces[interfaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`   → http://${iface.address}:${PORT}`);
      }
    }
  }
  console.log(`\n✨ Готов к работе!\n`);
});