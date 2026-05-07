import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";
import { ToastComponent } from "../../components/toast/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.toast = new ToastComponent();
        this.accounts = [];
    }

    async loadAccounts(title = '') {
        try {
            const url = title ? `http://localhost:3000/api/accounts?title=${encodeURIComponent(title)}` : 'http://localhost:3000/api/accounts';
            const res = await fetch(url);
            if (!res.ok) throw new Error('Ошибка загрузки');
            this.accounts = await res.json();
            this.renderAccounts();
        } catch (err) {
            this.toast.show('Ошибка', 'Не удалось загрузить счета', 'danger');
        }
    }

    renderAccounts() {
        const container = this.pageRoot;
        container.innerHTML = '';
        this.accounts.forEach(item => {
            const card = new ProductCardComponent(container);
            card.render(item, this.clickCard);
        });
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `
            <div id="main-page">
                <div class="row mb-3 align-items-end">
                    <div class="col-md-6">
                        <input type="text" id="searchInput" class="form-control" placeholder="Поиск по названию счёта">
                    </div>
                    <div class="col-md-3">
                        <button id="searchBtn" class="btn btn-outline-secondary w-100">🔍 Найти</button>
                    </div>
                    <div class="col-md-3">
                        <button id="addAccountBtn" class="btn btn-alfa w-100">+ Добавить счёт</button>
                    </div>
                </div>
                <div class="row g-4 animated-page" id="accountsList"></div>
            </div>
        `;
    }

    clickCard = (e) => {
        const cardId = e.target.closest('button').dataset.id;
        this.toast.show("Переход", `Открыт счёт №${cardId}`, "primary");
        const productPage = new ProductPage(this.parent, cardId, this.toast);
        productPage.render();
    };

    async addAccount() {
        // Простая форма через prompt (можно заменить на модальное окно)
        const accountName = prompt('Введите название счёта');
        if (!accountName) return;
        const balance = parseFloat(prompt('Введите баланс (число)'));
        if (isNaN(balance)) return;
        const type = prompt('Тип (Дебетовая/Кредитная/Сберегательный)');
        const accountNumber = prompt('Номер счёта (например, 1234 5678 9012 3456)') || '0000 0000 0000 0000';
        const expiry = prompt('Срок действия (MM/YY)') || '01/30';

        const newAccount = { accountName, accountNumber, balance, type, expiry };
        try {
            const res = await fetch('http://localhost:3000/api/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAccount)
            });
            if (!res.ok) throw new Error();
            const created = await res.json();
            this.toast.show('Успех', `Счёт "${created.accountName}" создан`, 'success');
            this.loadAccounts(); // перезагружаем список
        } catch (err) {
            this.toast.show('Ошибка', 'Не удалось создать счёт', 'danger');
        }
    }

    async render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        // Вешаем обработчики
        document.getElementById('searchBtn').addEventListener('click', () => {
            const title = document.getElementById('searchInput').value;
            this.loadAccounts(title);
        });
        document.getElementById('addAccountBtn').addEventListener('click', () => this.addAccount());

        // Загружаем все счета
        await this.loadAccounts();
    }
}
