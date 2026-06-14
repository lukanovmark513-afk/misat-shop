"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const products_routes_1 = __importDefault(require("./routes/products.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const favorites_routes_1 = __importDefault(require("./routes/favorites.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const categories_routes_1 = __importDefault(require("./routes/categories.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const forms_routes_1 = __importDefault(require("./routes/forms.routes")); // ← ДОБАВИТЬ
const database_1 = require("./config/database");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// CORS настройки
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://192.168.0.21:5173'],
    credentials: true
}));
// Увеличиваем лимит для загрузки фото (50MB)
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Health check
app.get('/api/health', async (req, res) => {
    try {
        const db = await (0, database_1.getDb)();
        await db.get('SELECT 1');
        res.json({ status: 'ok', message: 'MISAT API работает', database: 'connected' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: 'Ошибка БД', error: error.message });
    }
});
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/products', products_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
app.use('/api/favorites', favorites_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/categories', categories_routes_1.default);
app.use('/api/orders', orders_routes_1.default);
app.use('/api/forms', forms_routes_1.default); // ← ДОБАВИТЬ
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Admin panel: http://localhost:${PORT}/api/admin`);
});
