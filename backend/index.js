const express = require('express');
const cors = require('cors');
const path = require('path');
const accountsRouter = require('./routes/accounts');
const accountsService = require('./services/accountsService');

const app = express();
const PORT = 3000;

const DATA_FILE_PATH = path.join(__dirname, 'data/accounts.json');
accountsService.init(DATA_FILE_PATH);

// Middleware
app.use(cors());
app.use(express.json());

// Логирующий middleware (опционально)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// API маршруты
app.use('/api/accounts', accountsRouter);

// Обработка 404 для несуществующих маршрутов
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Бэкенд запущен: http://localhost:${PORT}`);
    console.log(`API счетов: http://localhost:${PORT}/api/accounts`);
});
