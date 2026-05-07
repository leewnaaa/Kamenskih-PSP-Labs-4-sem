const express = require('express');
const cors = require('cors');
const path = require('path');
const accountsRouter = require('./routes/accounts');
const accountsService = require('./services/accountsService');

const app = express();
const PORT = 3000;

// Путь к файлу данных
const DATA_PATH = path.join(__dirname, 'data/accounts.json');
accountsService.init(DATA_PATH);

// Middleware
app.use(cors());              // разрешаем запросы с фронта (Live Server на другом порту)
app.use(express.json());      // парсинг JSON

// Логирующий middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Роуты
app.use('/api/accounts', accountsRouter);

// Обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Бэкенд запущен: http://localhost:${PORT}`);
    console.log(`API счетов: http://localhost:${PORT}/api/accounts`);
});
