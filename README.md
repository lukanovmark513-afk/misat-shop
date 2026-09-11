# 🛍️ MISAT - Интернет-магазин одежды

## 🚀 Быстрый старт

### 1. Запуск Docker
```bash
cd docker
docker-compose up -d
cd ..
```

### 2. Установка зависимостей
```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### 3. Запуск проекта
```bash
npm run dev
```

## 📱 Доступные адреса
- **Сайт:** http://localhost:5173
- **API:** http://localhost:5000
- **PgAdmin:** http://localhost:5050

## 🛠️ Технологии
- React 18 + TypeScript
- Redux Toolkit
- TailwindCSS
- Node.js + Express
- PostgreSQL + Redis

## 📁 Структура
```
misat-shop/
├── client/     # React frontend
├── server/     # Node.js backend
├── docker/     # Docker конфиги
└── uploads/    # Файлы
```