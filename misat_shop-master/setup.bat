@echo off
echo 🚀 Запуск MISAT...
echo.
echo 📦 Устанавливаем зависимости...
call npm install
cd client && call npm install && cd ..
cd server && call npm install && cd ..
echo.
echo 🐳 Запускаем Docker...
cd docker && docker-compose up -d && cd ..
echo.
echo ✅ Готово! Запусти start.bat
pause