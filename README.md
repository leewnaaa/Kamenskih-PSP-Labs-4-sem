# ЛР 4. Веб-приложение с бэкендом (Express.js + CRUD)

**Студент:** Каменских Елена Александровна
**Группа:** ИУ5-43Б
**Тема:** Финансы – банковские счета

**Цель работы:** освоить создание бэкенда на Node.js с использованием фреймворка Express.js, реализовать REST API для управления банковскими счетами (CRUD), интегрировать бэкенд с ранее разработанным фронтенд-приложением, добавить уведомления о результатах операций (тосты – компонент по варианту).

## Содержание

1. [Инструменты и технологии](#1-инструменты-и-технологии)
2. [Создание бэкенда на Express.js](#2-создание-бэкенда-на-expressjs)
   - 2.1 [Инициализация проекта](#21-инициализация-проекта)
   - 2.2 [Структура проекта (бэкенд)](#22-структура-проекта-бэкенд)
   - 2.3 [Реализация fileService.js](#23-реализация-fileservicejs)
   - 2.4 [accountsService.js – бизнес-логика](#24-accountsservicejs--бизнес-логика)
   - 2.5 [accountsController.js – обработка HTTP-запросов](#25-accountscontrollerjs--обработка-http-запросов)
   - 2.6 [Маршруты routes/accounts.js](#26-маршруты-routesaccountsjs)
   - 2.7 [Точка входа index.js](#27-точка-входа-indexjs)
3. [Тестирование API с помощью Postman](#3-тестирование-api-с-помощью-postman)
   - 3.1 [GET /api/accounts – получение всех счетов](#31-get-apiaccounts--получение-всех-счетов)
   - 3.2 [POST /api/accounts – создание нового счёта](#32-post-apiaccounts--создание-нового-счёта)
   - 3.3 [GET /api/accounts/:id – получение одного счёта](#33-get-apiaccountsid--получение-одного-счёта)
   - 3.4 [PATCH /api/accounts/:id – обновление счёта](#34-patch-apiaccountsid--обновление-счёта)
   - 3.5 [DELETE /api/accounts/:id – удаление счёта](#35-delete-apiaccountsid--удаление-счёта)
4. [Выводы](#4-выводы)

**Цель работы:** освоить создание бэкенда на Node.js с использованием фреймворка Express.js, реализовать REST API для управления банковскими счетами (CRUD), интегрировать бэкенд с ранее разработанным фронтенд-приложением, добавить уведомления о результатах операций (тосты – компонент по варианту).

---

## 1. Инструменты и технологии

- **Node.js** – среда выполнения JavaScript на сервере.
- **Express.js** – веб-фреймворк для создания REST API.
- **Nodemon** – утилита для автоматического перезапуска сервера при изменениях.
- **Postman** – инструмент для тестирования API.
- **Bootstrap 5** – стилизация интерфейса.
- **JavaScript (ES6)** – фронтенд-логика, fetch API.

---

## 2. Создание бэкенда на Express.js

### 2.1 Инициализация проекта

```bash
mkdir backend
cd backend
npm init -y
npm install express cors
npm install --save-dev nodemon
```

### 2.2 Структура проекта (бэкенд)

backend/
├── data/
│   └── accounts.json         # файл-хранилище счетов
├── services/
│   ├── fileService.js        # чтение/запись JSON
│   └── accountsService.js    # бизнес-логика работы со счетами
├── controllers/
│   └── accountsController.js # обработка запросов
├── routes/
│   └── accounts.js           # маршруты API
├── index.js                  # точка входа (настройка сервера)
└── package.json

### 2.3 Реализация fileService.js

Сервис для синхронного чтения и записи JSON-файла.

``` js
const fs = require('fs');

const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
        return [];
    }
};

const writeData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Ошибка записи файла:', err);
    }
};

module.exports = { readData, writeData };
```

### 2.4 accountsService.js – бизнес-логика

Содержит методы CRUD и инициализацию пути к файлу.

``` js
const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => { dataFilePath = filePath; };

const findAll = (title) => {
    const accounts = fileService.readData(dataFilePath);
    if (title) {
        return accounts.filter(acc =>
            acc.accountName.toLowerCase().includes(title.toLowerCase())
        );
    }
    return accounts;
};

const findOne = (id) => {
    const accounts = fileService.readData(dataFilePath);
    return accounts.find(acc => acc.id === id);
};

const create = (accountData) => {
    const accounts = fileService.readData(dataFilePath);
    const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    const newAccount = { id: newId, ...accountData };
    accounts.push(newAccount);
    fileService.writeData(dataFilePath, accounts);
    return newAccount;
};

const update = (id, accountData) => {
    const accounts = fileService.readData(dataFilePath);
    const index = accounts.findIndex(a => a.id === id);
    if (index === -1) return null;
    accounts[index] = { ...accounts[index], ...accountData };
    fileService.writeData(dataFilePath, accounts);
    return accounts[index];
};

const remove = (id) => {
    const accounts = fileService.readData(dataFilePath);
    const filtered = accounts.filter(a => a.id !== id);
    if (filtered.length === accounts.length) return false;
    fileService.writeData(dataFilePath, filtered);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };
```

### 2.5 accountsController.js – обработка HTTP-запросов

Контроллер принимает req, res, вызывает методы сервиса и формирует ответ.

``` js
const accountsService = require('../services/accountsService');

const getAll = (req, res) => {
    const { title } = req.query;
    const accounts = accountsService.findAll(title);
    res.json(accounts);
};

const getOne = (req, res) => {
    const id = parseInt(req.params.id);
    const account = accountsService.findOne(id);
    if (!account) return res.status(404).json({ error: 'Счёт не найден' });
    res.json(account);
};

const create = (req, res) => {
    const { accountName, accountNumber, balance, type, expiry, creditLimit, percent } = req.body;
    if (!accountName || !accountNumber || balance === undefined || !type) {
        return res.status(400).json({ error: 'Не все обязательные поля заполнены' });
    }
    const newAccount = accountsService.create({ accountName, accountNumber, balance, type, expiry, creditLimit, percent });
    res.status(201).json(newAccount);
};

const update = (req, res) => {
    const id = parseInt(req.params.id);
    const updated = accountsService.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Счёт не найден' });
    res.json(updated);
};

const remove = (req, res) => {
    const id = parseInt(req.params.id);
    const success = accountsService.remove(id);
    if (!success) return res.status(404).json({ error: 'Счёт не найден' });
    res.status(204).send();
};

module.exports = { getAll, getOne, create, update, remove };
```

### 2.6 Маршруты routes/accounts.js

``` js
const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');

router.get('/', accountsController.getAll);
router.get('/:id', accountsController.getOne);
router.post('/', accountsController.create);
router.patch('/:id', accountsController.update);
router.delete('/:id', accountsController.remove);

module.exports = router;
```

### 2.7 Точка входа index.js

Настройка middleware, подключение CORS, обработка ошибок, запуск сервера.

``` js
const express = require('express');
const cors = require('cors');
const path = require('path');
const accountsRouter = require('./routes/accounts');
const accountsService = require('./services/accountsService');

const app = express();
const PORT = 3000;

const DATA_FILE_PATH = path.join(__dirname, 'data/accounts.json');
accountsService.init(DATA_FILE_PATH);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/api/accounts', accountsRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Бэкенд запущен: http://localhost:${PORT}`);
    console.log(`API счетов: http://localhost:${PORT}/api/accounts`);
});
```
Бэкенд работает на порту 3000, фронтенд будет обращаться к нему через fetch

## 3. Тестирование API с помощью Postman

### 3.1 GET /api/accounts – получение всех счетов
![Фото 1](images_for_README/image1.png)

### 3.2 POST /api/accounts – создание нового счёта
![Фото 2](images_for_README/image2.png)

### 3.3 GET /api/accounts/:id – получение одного счёта
![Фото 3](images_for_README/image3.png)

### 3.4 PATCH /api/accounts/:id – обновление счёта
![Фото 4](images_for_README/image4.png)

### 3.5 DELETE /api/accounts/:id – удаление счёта
![Фото 5](images_for_README/image4.png)

## 4. Выводы

В ходе лабораторной работы были выполнены следующие задачи:

1. Создан полноценный бэкенд на Express.js с CRUD-операциями для банковских счетов.

2. Реализована REST API (GET, POST, PATCH, DELETE) с хранением данных в JSON-файле.

3. Протестированы все эндпоинты через Postman.

4. Фронтенд-приложение (ЛР №3) адаптировано для работы с сервером через fetch API.

5. Добавлены уведомления (тосты) для информирования пользователя о результатах операций – компонент по варианту «финансы».

6. Приложение стало полностью функциональным: данные загружаются с сервера, возможны создание, просмотр, изменение и удаление счетов.

Таким образом, цель работы – освоение интеграции фронтенда с бэкендом на Node.js/Express – достигнута.
