# ЛР 6. Веб-приложение: Promise, fetch, сборка клиентской части

**Студент:** Каменских Елена Александровна
**Группа:** ИУ5-43Б
**Тема:** Финансы – банковские счета

## Цель работы

1. Заменить механизм взаимодействия с бэкендом с `XMLHttpRequest` на современный `fetch` с использованием промисов и `async/await`.
2. Настроить сборку клиентской части (фронтенда) с помощью **Vite**.
3. Интегрировать собранный фронтенд в бэкенд (Express.js) для раздачи статических файлов, устранив необходимость в CORS и упростив развёртывание.

---

## 1. Теоретическая часть: Promise, async/await, fetch

### 1.1 Promise

**Promise** – объект, представляющий результат асинхронной операции. Состояния:
- `pending` – ожидание,
- `fulfilled` – успешное выполнение,
- `rejected` – ошибка.

```js
const promise = new Promise((resolve, reject) => {
    if (success) resolve(data);
    else reject(error);
});
```
Обработка: .then(), .catch(), .finally()

### 1.2 async/await

async-функция всегда возвращает промис. await приостанавливает выполнение до разрешения промиса, делает асинхронный код похожим на синхронный.

``` js
async function fetchData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}
```

### 1.3 Fetch API

fetch – современная замена XMLHttpRequest, возвращает промис. Позволяет легко выполнять GET, POST, PATCH, DELETE запросы.

## 2. Реализация в проекте
### Модуль ajax.js (замена XHR на fetch)

Все сетевые вызовы вынесены в отдельный класс Ajax:

``` js
// modules/ajax.js
class Ajax {
    async get(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    }

    async post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    }

    async patch(url, data) { /* аналогично */ }
    async delete(url) { /* аналогично */ }
}

export const ajax = new Ajax();
```

### 2.2 Использование в страницах

Главная страница (MainPage) – загрузка счетов с поиском:

``` js
async loadAccounts(title = '') {
    try {
        let url = stockUrls.getStocks();
        if (title) url += `?title=${encodeURIComponent(title)}`;
        const data = await ajax.get(url);
        this.accounts = data;
        this.renderAccounts();
    } catch {
        this.toast.show('Ошибка', 'Не удалось загрузить счета', 'danger');
    }
}
```

Создание счёта:

``` js
async addAccount() {
    const newAccount = { accountName, accountNumber, balance, type, expiry };
    try {
        await ajax.post(stockUrls.createStock(), newAccount);
        this.toast.show('Успех', `Счёт "${newAccount.accountName}" создан`, 'success');
        await this.loadAccounts();
    } catch {
        this.toast.show('Ошибка', 'Не удалось создать счёт', 'danger');
    }
}
```

Страница деталей (ProductPage):

``` js
async getData() {
    try {
        return await ajax.get(stockUrls.getStockById(this.id));
    } catch {
        this.toast.show('Ошибка', 'Счёт не найден', 'danger');
        return null;
    }
}
```
Все вызовы асинхронны, код линеен и легко читаем. Ошибки обрабатываются через try/catch, пользователь получает уведомления через ToastComponent

### 3. Сборка клиентской части с помощью Vite
## 3.1 Установка и настройка

В папке с фронтендом установлен Vite:

``` bash
npm install -D vite
```

Добавлены скрипты в package.json:

``` json
"scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
}
```

Создан vite.config.js:
``` js
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: '../backend/static',   // сборка сразу в папку бэкенда
        emptyOutDir: true,
    },
    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:3000'   // прокси на бэкенд
        }
    }
});
```
outDir – результат сборки помещается в backend/static.

proxy в dev-режиме перенаправляет запросы /api на бэкенд, чтобы избежать CORS.

### 3.2 Режимы работы

Разработка: npm run dev → сервер Vite на http://localhost:5173 с горячей перезагрузкой.

Сборка: npm run build → создание оптимизированных файлов в ../backend/static.

Просмотр сборки: npm run preview → локальный сервер, раздающий результат сборки.

## 4. Интеграция с бэкендом: раздача статики
### 4.1 Настройка Express.js
В backend/index.js добавлена раздача статических файлов и обработка SPA-роутинга:

``` js
const path = require('path');

app.use(express.static(path.join(__dirname, 'static')));

// SPA fallback: для всех не-API запросов отдаём index.html
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        next();
    } else {
        res.sendFile(path.join(__dirname, 'static', 'index.html'));
    }
});
```
Теперь бэкенд обслуживает и API, и фронтенд на одном порту (3000).

### 4.2 Запуск приложения

1. Собрать фронтенд: npm run build (в папке frontend).

2. Запустить бэкенд: npm run dev (в папке backend).

3. Открыть http://localhost:3000 – приложение полностью работает без CORS.

## 5. Выводы

В ходе работы:

1. Обновлён способ взаимодействия – все вызовы к API переписаны с XMLHttpRequest на fetch с использованием async/await. Код стал чище и легче сопровождается.

2. Настроена сборка Vite – фронтенд собирается в оптимизированные статические файлы, готовые к production.

3. Интегрирована статика в бэкенд – Express.js раздаёт собранный фронтенд, приложение работает на едином порту без CORS.

4. Улучшен UX – все ошибки и успешные операции сопровождаются всплывающими уведомлениями (тостами), что соответствует варианту «финансы».

Цель работы – освоение современных методов асинхронного программирования и сборки frontend-приложений – полностью достигнута.
