-- Удаляем старые таблицы
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Пользователи
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Заказы
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    total DECIMAL(10, 2) NOT NULL,
    delivery_address TEXT,
    phone VARCHAR(20),
    comment TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем админа (пароль: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@misat.com', '$2a$10$rQHqXxZxZxZxZxZxZxZxZu', 'Admin', 'MISAT', 'admin');

-- Добавляем тестового пользователя (пароль: user123)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('user@test.com', '$2a$10$rQHqXxZxZxZxZxZxZxZxZu', 'Test', 'User', 'user');

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_users_email ON users(email);