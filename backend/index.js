const express = require('express');
const cors = require('cors');
const path = require('path');
const accountsRouter = require('./routes/accounts');
const accountsService = require('./services/accountsService');

const app = express();
const PORT = 3000;

// Путь к файлу данных
const DATA_FILE_PATH = path.join(__dirname, 'data/accounts.json');

// Инициализируем сервис работы со счетами
accountsService.init(DATA_FILE_PATH);

// Middleware
app.use(cors());                    // разрешаем кросс-доменные запросы (на время разработки)
app.use(express.json());            // парсинг JSON тела запросов

// Логирующий middleware (для отладки)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Раздача статических файлов (собранный фронтенд)
// Предполагается, что сборка Vite лежит в папке backend/static
app.use(express.static(path.join(__dirname, 'static')));

// API маршруты
app.use('/api/accounts', accountsRouter);

// Для всех остальных маршрутов (которые не /api/...) отдаём index.html
app.use((req, res, next) => {
    // Если запрос начинается с /api — пропускаем дальше (там уже есть обработчики)
    if (req.path.startsWith('/api')) {
        next();
    } else {
        // Для всех остальных путей отдаём index.html (SPA-роутинг)
        res.sendFile(path.join(__dirname, 'static', 'index.html'));
    }
});

// Обработчик ошибок (должен быть после всех маршрутов)
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Бэкенд запущен: http://localhost:${PORT}`);
    console.log(`API счетов: http://localhost:${PORT}/api/accounts`);
    console.log(`Статика раздаётся из папки ${path.join(__dirname, 'static')}`);
});
