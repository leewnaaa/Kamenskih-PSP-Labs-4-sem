const express = require('express');
const path = require('path');
const accountsRouter = require('./routes/accounts');
const accountsService = require('./services/accountsService');

const app = express();
const PORT = 3000;

const DATA_PATH = path.join(__dirname, 'data/accounts.json');
accountsService.init(DATA_PATH);

app.use(express.json());  // парсинг JSON

// Логирующий middleware (опционально)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// API маршруты
app.use('/api/accounts', accountsRouter);

// Обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// setInterval(() => {}, 1000);
// console.log('Блокирующий таймер запущен');

app.listen(PORT, () => {
    console.log(`Бэкенд запущен: http://localhost:${PORT}`);
    console.log(`API счетов: http://localhost:${PORT}/api/accounts`);
});
