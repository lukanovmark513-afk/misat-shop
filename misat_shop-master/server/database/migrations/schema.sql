-- =============================================
-- БАЗА ДАННЫХ МАГАЗИНА MISAT
-- =============================================

-- =============================================
-- 1. ПОЛЬЗОВАТЕЛИ
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT 1,
    email_verified BOOLEAN DEFAULT 0,
    reset_token VARCHAR(255),
    reset_token_expires DATETIME,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 2. КАТЕГОРИИ
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(255),
    parent_id INTEGER,
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- =============================================
-- 3. ТОВАРЫ
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    description TEXT,
    short_description VARCHAR(500),
    category_id INTEGER,
    brand VARCHAR(100),

    -- Изображения (JSON массив)
    images TEXT DEFAULT '[]',
    main_image VARCHAR(255),

    -- Характеристики (JSON)
    sizes TEXT DEFAULT '[]',
    colors TEXT DEFAULT '[]',
    materials TEXT,
    care_instructions TEXT,

    -- Остатки
    stock INTEGER DEFAULT 0,
    reserved_stock INTEGER DEFAULT 0,

    -- Тип наличия: in_stock, preorder, out_of_stock
    stock_type VARCHAR(20) DEFAULT 'in_stock',
    preorder_days INTEGER,
    prepayment_percent INTEGER DEFAULT 70,

    -- Рейтинг и отзывы
    rating DECIMAL(3, 2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,

    -- Флаги
    is_new BOOLEAN DEFAULT 0,
    is_sale BOOLEAN DEFAULT 0,
    is_bestseller BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,

    -- Meta для SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,

    views_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- =============================================
-- 4. КОРЗИНА
-- =============================================
CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    size VARCHAR(20),
    color VARCHAR(50),
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id, size, color)
);

-- =============================================
-- 5. ЗАКАЗЫ
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER,

    -- Данные получателя
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,

    -- Адрес доставки
    delivery_address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    delivery_comment TEXT,

    -- Способ доставки
    delivery_method VARCHAR(50) DEFAULT 'courier',
    delivery_price DECIMAL(10, 2) DEFAULT 0,

    -- Способ оплаты
    payment_method VARCHAR(50) DEFAULT 'card_online',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_id VARCHAR(255),

    -- Итоги
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,

    -- Статус заказа
    status VARCHAR(50) DEFAULT 'pending',
    status_history TEXT DEFAULT '[]',

    -- Комментарий
    comment TEXT,

    -- Промокод
    promo_code VARCHAR(50),
    promo_discount DECIMAL(10, 2) DEFAULT 0,

    -- Временные метки
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- 6. ТОВАРЫ В ЗАКАЗЕ
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    size VARCHAR(20),
    color VARCHAR(50),
    total DECIMAL(10, 2) NOT NULL,

    -- Для архивации
    product_snapshot TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- =============================================
-- 7. ОТЗЫВЫ
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    order_id INTEGER,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    pros TEXT,
    cons TEXT,
    images TEXT DEFAULT '[]',
    is_verified BOOLEAN DEFAULT 0,
    is_approved BOOLEAN DEFAULT 1,
    helpful_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- =============================================
-- 8. ИЗБРАННОЕ
-- =============================================
CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

-- =============================================
-- 9. ПРОМОКОДЫ
-- =============================================
CREATE TABLE IF NOT EXISTS promo_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) DEFAULT 'percent', -- percent, fixed
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2),

    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    per_user_limit INTEGER DEFAULT 1,

    start_date DATETIME,
    end_date DATETIME,

    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 10. ИСПОЛЬЗОВАННЫЕ ПРОМОКОДЫ
-- =============================================
CREATE TABLE IF NOT EXISTS promo_code_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    promo_code_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    order_id INTEGER NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL,
    used_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    UNIQUE(promo_code_id, user_id, order_id)
);

-- =============================================
-- 11. ПОДПИСКА НА УВЕДОМЛЕНИЯ
-- =============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- 12. СЕССИИ
-- =============================================
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- 13. ПАРОЛИ ДЛЯ ВОССТАНОВЛЕНИЯ
-- =============================================
CREATE TABLE IF NOT EXISTS password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- 14. АКТИВНОСТЬ ПОЛЬЗОВАТЕЛЕЙ
-- =============================================
CREATE TABLE IF NOT EXISTS user_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- 15. УВЕДОМЛЕНИЯ
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- 16. НАСТРОЙКИ МАГАЗИНА
-- =============================================
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ИНДЕКСЫ
-- =============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating DESC);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_slug ON products(slug);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active, start_date, end_date);

-- =============================================
-- ТРИГГЕРЫ
-- =============================================

-- Обновление updated_at при изменении записей
CREATE TRIGGER IF NOT EXISTS update_users_timestamp
AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_products_timestamp
AFTER UPDATE ON products
BEGIN
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_orders_timestamp
AFTER UPDATE ON orders
BEGIN
    UPDATE orders SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_settings_timestamp
AFTER UPDATE ON settings
BEGIN
    UPDATE settings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Обновление рейтинга товара при добавлении/обновлении отзыва
CREATE TRIGGER IF NOT EXISTS update_product_rating_insert
AFTER INSERT ON reviews
WHEN NEW.is_approved = 1
BEGIN
    UPDATE products SET
        rating = (
            SELECT ROUND(AVG(rating), 2)
            FROM reviews
            WHERE product_id = NEW.product_id AND is_approved = 1
        ),
        reviews_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE product_id = NEW.product_id AND is_approved = 1
        )
    WHERE id = NEW.product_id;
END;

CREATE TRIGGER IF NOT EXISTS update_product_rating_update
AFTER UPDATE ON reviews
WHEN NEW.is_approved = 1
BEGIN
    UPDATE products SET
        rating = (
            SELECT ROUND(AVG(rating), 2)
            FROM reviews
            WHERE product_id = NEW.product_id AND is_approved = 1
        ),
        reviews_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE product_id = NEW.product_id AND is_approved = 1
        )
    WHERE id = NEW.product_id;
END;

-- =============================================
-- НАЧАЛЬНЫЕ ДАННЫЕ
-- =============================================

-- 1. Категории
INSERT OR IGNORE INTO categories (name, slug, sort_order) VALUES
('Одежда', 'odezhda', 1),
('Обувь', 'obuv', 2),
('Аксессуары', 'aksessuary', 3),
('Спорт', 'sport', 4),
('Футболки', 'futbolki', 10),
('Худи', 'hudi', 11),
('Джинсы', 'dzhinsy', 12),
('Кепки', 'kepki', 13),
('Кроссовки', 'krossovki', 14),
('Сумки', 'sumki', 15);

-- 2. Администратор (пароль: Admin@MISAT2025!)
INSERT OR IGNORE INTO users (email, password_hash, first_name, last_name, phone, role, is_active, email_verified) VALUES
('admin@misat.com', '$2a$10$rQHqXxZxZxZxZxZxZxZxZu', 'Admin', 'MISAT', '+7 (999) 123-45-67', 'admin', 1, 1);

-- 3. Настройки
INSERT OR IGNORE INTO settings (key, value, description) VALUES
('shop_name', 'MISAT', 'Название магазина'),
('shop_email', 'info@misat.com', 'Email магазина'),
('shop_phone', '+7 (999) 123-45-67', 'Телефон магазина'),
('shop_address', 'г. Москва, ул. Тверская, д. 1', 'Адрес магазина'),
('delivery_price', '500', 'Стоимость доставки'),
('free_delivery_from', '5000', 'Бесплатная доставка от'),
('order_statuses', '["pending","processing","shipped","delivered","cancelled"]', 'Статусы заказов'),
('currency', '₽', 'Валюта'),
('timezone', 'Europe/Moscow', 'Часовой пояс');

-- 4. Промокоды
INSERT OR IGNORE INTO promo_codes (code, description, discount_type, discount_value, min_order_amount, usage_limit, start_date, end_date) VALUES
('WELCOME10', 'Скидка 10% на первый заказ', 'percent', 10, 0, 1000, datetime('now'), datetime('now', '+1 year')),
('WELCOME15', 'Скидка 15% на первый заказ', 'percent', 15, 3000, 500, datetime('now'), datetime('now', '+6 months')),
('FREESHIP', 'Бесплатная доставка', 'fixed', 500, 3000, 200, datetime('now'), datetime('now', '+3 months'));

-- =============================================
-- ПРЕДСТАВЛЕНИЯ (VIEWS)
-- =============================================

-- Активные товары с категориями
CREATE VIEW IF NOT EXISTS v_products_with_categories AS
SELECT
    p.*,
    c.name as category_name,
    c.slug as category_slug
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = 1;

-- Детали заказов
CREATE VIEW IF NOT EXISTS v_order_details AS
SELECT
    o.*,
    u.first_name || ' ' || u.last_name as user_full_name,
    u.email as user_email,
    u.phone as user_phone,
    (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items_count
FROM orders o
LEFT JOIN users u ON o.user_id = u.id;

-- Популярные товары
CREATE VIEW IF NOT EXISTS v_popular_products AS
SELECT
    p.*,
    COALESCE(SUM(oi.quantity), 0) as total_sold,
    COALESCE(SUM(oi.total), 0) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id
ORDER BY total_sold DESC;

-- Общая статистика
CREATE VIEW IF NOT EXISTS v_shop_stats AS
SELECT
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM products WHERE is_active = 1) as active_products,
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status != 'cancelled') as total_revenue,
    (SELECT COALESCE(AVG(rating), 0) FROM products WHERE is_active = 1) as avg_rating,
    (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders;