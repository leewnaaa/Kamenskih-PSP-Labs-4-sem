# ЛР 3. Простое веб-приложение. Финансовый помощник

## Содержание

1. [Инструменты для работы](#1-инструменты-для-работы)
2. [Что такое node, npm и package.json](#2-что-такое-node-npm-и-packagejson)
3. [Организация проекта: страницы и компоненты](#3-организация-проекта-страницы-и-компоненты)
4. [Инициализация проекта и подключение bootstrap](#4-инициализация-проекта-и-подключение-bootstrap)
5. [Создание главной страницы (список счетов)](#5-создание-главной-страницы-список-счетов)
6. [Создание карточки счёта (ProductCardComponent)](#6-создание-карточки-счёта-productcardcomponent)
7. [Создание страницы деталей счёта (ProductPage)](#7-создание-страницы-деталей-счёта-productpage)
8. [Компонент детального просмотра (ProductComponent)](#8-компонент-детального-просмотра-productcomponent)
9. [Реализация кнопки назад (BackButtonComponent)](#9-реализация-кнопки-назад-backbuttoncomponent)
10. [Добавление уведомлений (ToastComponent) – компонент по варианту](#10-добавление-уведомлений-toastcomponent--компонент-по-варианту)
11. [Логика расчёта срока действия карты](#11-логика-расчёта-срока-действия-карты)
12. [Скриншоты работающего приложения](#12-скриншоты-работающего-приложения)
13. [Выводы](#13-выводы)


**Цель** данной лабораторной работы - знакомство с node, npm, написание простого приложения на JavaScript с использованием компонентного подхода. В ходе выполнения работы создано приложение для управления банковскими счетами с возможностью просмотра деталей и получения уведомлений о статусе карт.

***Тема:*** Финансы
***Компонент:*** Всплывающие сообщения (toasts)

![Фото 1](images_for_README/image1.png)
![Фото 2](images_for_README/image2.png)

## План отчета

1. Инструменты для работы
2. Что такое node, npm и package.json
3. Организация проекта: страницы и компоненты
4. Инициализация проекта и подключение bootstrap
5. Создание главной страницы (список счетов)
6. Создание карточки счета (`ProductCardComponent`)
7. Создание страницы деталей счёта (`ProductPage`)
8. Компонент детального просмотра (`ProductComponent`)
9. Реализация кнопки назад (`BackButtonComponent`)
10. Добавление уведомлений (`ToastComponent`) – компонент по варианту
11. Логика расчёта срока действия карты
12. Скриншоты работающего приложения
13. Выводы

---

## 1. Инструменты для работы

Для разработки использовались:

- [Visual Studio Code][vs-code] с расширением [Live Server][vs-code-live-server]
- [Node.js][node-install] (для управления пакетами и запуска сборки)
- Браузер Chrome (для тестирования)

## 2. Что такое node, npm и package.json

**Node.js** – среда выполнения JavaScript вне браузера. Она позволяет использовать npm – пакетный менеджер для установки внешних библиотек (bootstrap, three.js и т.д.).

**package.json** – файл, описывающий проект: название, версию, зависимости, скрипты.
**package-lock.json** – фиксирует точные версии всех установленных пакетов, включая вложенные зависимости.

## 3. Организация проекта: страницы и компоненты

Проект структурирован по модульному принципу:

- `components/` – переиспользуемые блоки интерфейса
  - `back-button/` – кнопка возврата
  - `product-card/` – карточка счёта на главной
  - `product/` – детальное отображение счёта
  - `toast/` – всплывающие уведомления (компонент по варианту)
- `pages/` – целые страницы
  - `main/` – главная страница со списком счетов
  - `product/` – страница деталей выбранного счёта
- `main.js` – точка входа, рендерит начальную страницу
- `index.html` – корневой HTML с элементом `<div id="root">`

Такая архитектура облегчает поддержку и масштабирование.

## 4. Инициализация проекта и подключение bootstrap

1. Создана пустая папка, открыта в VS Code.
2. Выполнена команда `npm init` (параметры по умолчанию).
3. Установлен Bootstrap: `npm i bootstrap`.
4. В `index.html` добавлены:
   - ссылка на CSS Bootstrap в `<head>`
   - скрипт для JS Bootstrap перед закрывающим `<body>`
   - корневой `<div id="root">`

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Альфа-Банк</title>
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div id="root"></div>
    <script src="main.js" type="module"></script>
    <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

## 5. Инициализация проекта и подключение bootstrap

Главная страница (MainPage) отвечает за отображение списка банковских продуктов. Она получает данные (три счета) и для каждого создаёт компонент ProductCardComponent.

``` js
// pages/main/index.js
import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getData() {
        return [
            { id: 1, accountName: "Дебетовая карта Premium", accountNumber: "5536 9148 2345 6789", balance: 125800, type: "Дебетовая", expiry: "08/28" },
            { id: 2, accountName: "Кредитная карта 100 дней", accountNumber: "4276 8901 2345 1112", balance: 50000, type: "Кредитная", expiry: "03/26", creditLimit: "150 000 ₽" },
            { id: 3, accountName: "Накопительный счёт", accountNumber: "4081 7810 9023 4567", balance: 450300, type: "Сберегательный", expiry: "—", percent: "6%" }
        ];
    }

    get pageRoot() {
        return document.getElementById('cards-grid');
    }

    getHTML() {
        return `<div class="row g-4 animated-page" id="cards-grid"></div>`;
    }

    clickCard(e) {
        const cardId = e.target.closest('button').dataset.id;
        const productPage = new ProductPage(this.parent, cardId);
        productPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        const data = this.getData();
        data.forEach(item => {
            const card = new ProductCardComponent(this.pageRoot);
            card.render(item, this.clickCard.bind(this));
        });
    }
}
```

## 6. Создание карточки счёта (ProductCardComponent)

Каждая карточка отображает баланс, тип, маскированный номер счёта и кнопку «Подробнее». При клике вызывается переданный из страницы обработчик.

``` js
// components/product-card/index.js
export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        const maskedNumber = data.accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
        return `
            <div class="col-md-4 col-sm-6 mb-4">
                <div class="account-card">
                    <div class="card-header-red"><i class="fas fa-credit-card me-1"></i> ${data.type}</div>
                    <div class="card-body-custom">
                        <small class="text-muted">Баланс</small>
                        <div class="account-balance">${data.balance.toLocaleString()} ₽</div>
                        <div class="account-number"><i class="far fa-credit-card"></i> ${maskedNumber}</div>
                        <div class="mt-2"><small>Срок действия: ${data.expiry}</small></div>
                    </div>
                    <div class="card-footer-custom">
                        <button class="btn btn-alfa w-100" id="click-card-${data.id}" data-id="${data.id}">
                            <i class="fas fa-arrow-right me-1"></i> Подробнее
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    addListeners(data, listener) {
        document.getElementById(`click-card-${data.id}`).addEventListener("click", listener);
    }

    render(data, listener) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
        this.addListeners(data, listener);
    }
}
```

## 7. Создание страницы деталей счёта (ProductPage)

Страница продукта принимает id выбранного счёта, загружает соответствующие данные и отображает компонент ProductComponent. Также добавляется кнопка назад.

``` js
// pages/product/index.js
import { ProductComponent } from "../../components/product/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    getData() {
        const accounts = {
            1: { accountName: "Дебетовая карта Premium", accountNumber: "5536 9148 2345 6789", balance: 125800, type: "Дебетовая", expiry: "08/28", creditLimit: null },
            2: { accountName: "Кредитная карта 100 дней", accountNumber: "4276 8901 2345 1112", balance: 50000, type: "Кредитная", expiry: "03/26", creditLimit: "150 000 ₽" },
            3: { accountName: "Накопительный счёт", accountNumber: "4081 7810 9023 4567", balance: 450300, type: "Сберегательный", expiry: "—", percent: "6%" }
        };
        return accounts[this.id];
    }

    get pageRoot() { return document.getElementById('product-page'); }

    getHTML() { return `<div id="product-page" class="animated-page py-3"></div>`; }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        const data = this.getData();
        const product = new ProductComponent(this.pageRoot);
        product.render(data);
    }
}
```

## 8. Инициализация проекта и подключение bootstrap

Показывает развёрнутую информацию о счёте: номер, баланс, тип, кредитный лимит (если есть), процентную ставку (для накопительного). Дополнительно отображает предупреждение о сроке действия карты (через ToastComponent или прямо в интерфейсе). В нашем случае – предупреждение в виде цветной строки.

``` js
// components/product/index.js
export class ProductComponent {
    constructor(parent) { this.parent = parent; }

    getDaysLeft(expiry) { /* вычисление дней до окончания */ }
    getWarningInfo(expiry) { /* возвращает текст и класс */ }

    getHTML(data) {
        const expiryWarning = this.getWarningInfo(data.expiry);
        return `
            <div class="detail-card">
                <div class="detail-header">
                    <i class="fas fa-university fa-2x"></i>
                    <h3 class="mt-2">${data.accountName}</h3>
                </div>
                <div class="detail-body">
                    <table class="table table-borderless">
                        <tr><td><i class="fas fa-id-card"></i> Номер счёта</td><td><strong>${data.accountNumber}</strong></td></tr>
                        <tr><td><i class="fas fa-ruble-sign"></i> Баланс</td><td><strong class="text-danger fs-4">${data.balance.toLocaleString()} ₽</strong></td></tr>
                        <tr><td><i class="fas fa-chart-line"></i> Тип</td><td>${data.type}</td></tr>
                        ${data.creditLimit ? `<tr><td><i class="fas fa-credit-card"></i> Кредитный лимит</td><td>${data.creditLimit}</td></tr>` : ''}
                        ${data.percent ? `<tr><td><i class="fas fa-percent"></i> Ставка</td><td>${data.percent}</td></tr>` : ''}
                        <tr><td><i class="far fa-calendar-alt"></i> Срок действия</td><td>${data.expiry}</td></tr>
                    </table>
                    ${expiryWarning ? `<div class="alert alert-...">${expiryWarning.text}</div>` : ''}
                </div>
            </div>
        `;
    }

    render(data) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
    }
}
```

## 9. Реализация кнопки назад (BackButtonComponent)

Простой компонент с кнопкой, которая вызывает переданный обработчик.

``` js
// components/back-button/index.js
export class BackButtonComponent {
    constructor(parent) { this.parent = parent; }

    getHTML() { return `<button id="back-button" class="btn btn-secondary mt-3">← Назад</button>`; }

    addListeners(listener) { document.getElementById("back-button").addEventListener("click", listener); }

    render(listener) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        this.addListeners(listener);
    }
}
```

## 10. Добавление уведомлений (ToastComponent)

компонент ToastComponent показывает уведомления в правом нижнем углу и автоматически исчезает через 3.5 секунды. Уведомления используются для информирования пользователя об успешных действиях или ошибках.

``` js
// components/toast/index.js
export class ToastComponent {
    constructor(containerId = 'toastContainer') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = containerId;
            this.container.className = 'toast-container-custom';
            document.body.appendChild(this.container);
        }
    }

    getHTML(title, message, type) {
        const icon = type === 'danger' ? 'fa-exclamation-circle' : 'fa-check-circle';
        const bgClass = type === 'danger' ? 'bg-danger' : 'bg-success';
        return `
            <div class="toast align-items-center text-white ${bgClass} border-0 mb-3 shadow-lg" role="alert" data-bs-autohide="true" data-bs-delay="3500">
                <div class="d-flex align-items-center p-2">
                    <i class="fas ${icon} me-2 fs-5"></i>
                    <div class="toast-body flex-grow-1"><strong>${title}</strong><br>${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
    }

    show(title, message, type = 'success') {
        this.container.insertAdjacentHTML('beforeend', this.getHTML(title, message, type));
        const toastEl = this.container.lastElementChild;
        const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 3500 });
        toast.show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }
}
```

## 11. Логика расчёта срока действия карты
В компоненте ProductComponent реализована функция getDaysLeft(expiry), которая вычисляет количество дней до окончания срока действия карты (формат MM/YY). На основе этого генерируется предупреждение:

1. если срок истёк – красное сообщение «⚠️ Срок действия истёк!»

2. если осталось ≤30 дней – «⚠️ Срок истекает через X дней!»

3. если осталось ≤90 дней – жёлтое предупреждение

4. иначе – зелёное «✅ Срок действия действителен ещё X дней»

Это повышает информативность для пользователя.

![Фото 3](images_for_README/image2.png)
![Фото 4](images_for_README/image3.png)

## 12.  Выводы

В ходе лабораторной работы были освоены:

1. работа с Node.js и npm для управления зависимостями;

2. создание структурированного веб-приложения на чистом JavaScript;

3. разделение интерфейса на компоненты и страницы;

4. использование Bootstrap для быстрой стилизации;

5. реализация навигации между страницами (главная → детали → назад);

6. создание собственного компонента всплывающих уведомлений (toast), соответствующего варианту «финансы»;

7. применение дополнительной логики (расчёт срока действия карты) для улучшения пользовательского опыта.

Таким образом, цель работы – знакомство с современными инструментами разработки frontend-приложений – полностью достигнута.
