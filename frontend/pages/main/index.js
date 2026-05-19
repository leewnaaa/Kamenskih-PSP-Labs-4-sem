import { ajax } from "../../modules/ajax.js";
import { stockUrls } from "../../modules/stockUrls.js";
import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";
import { ToastComponent } from "../../components/toast/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.toast = new ToastComponent();
        this.accounts = [];
    }

    // Загрузка счетов с сервера через XHR (GET)
    loadAccounts(title = '') {
        let url = stockUrls.getStocks();
        if (title) {
            url += `?title=${encodeURIComponent(title)}`;
        }
        ajax.get(url, (data, status) => {
            if (status === 200 && data) {
                this.accounts = data;
                this.renderAccounts();
            } else {
                this.toast.show('Ошибка', 'Не удалось загрузить счета', 'danger');
            }
        });
    }

    // Отрисовка карточек счетов
    renderAccounts() {
        const container = this.pageRoot;
        container.innerHTML = '';
        this.accounts.forEach(item => {
            const card = new ProductCardComponent(container);
            card.render(item, this.clickCard);
        });
    }

    get pageRoot() {
        return document.getElementById('accountsList');
    }

    getHTML() {
        return `
            <div id="main-page">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2>Мои счета</h2>
                </div>
                <div class="row mb-3 align-items-end">
                    <div class="col-md-6">
                        <input type="text" id="searchInput" class="form-control" placeholder="Поиск по названию счёта">
                    </div>
                    <div class="col-md-3">
                        <button id="searchBtn" class="btn btn-outline-secondary w-100">Найти</button>
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
        const productPage = new ProductPage(this.parent, cardId, this.toast);
        productPage.render();
    };

    addAccount() {
        const accountName = prompt('Введите название счёта');
        if (!accountName) return;
        const balance = parseFloat(prompt('Введите баланс (число)'));
        if (isNaN(balance)) return;
        const type = prompt('Тип (Дебетовая/Кредитная/Сберегательный)');
        const accountNumber = prompt('Номер счёта (например, 1234 5678 9012 3456)') || '0000 0000 0000 0000';
        const expiry = prompt('Срок действия (MM/YY)') || '01/30';

        const newAccount = { accountName, accountNumber, balance, type, expiry };
        ajax.post(stockUrls.createStock(), newAccount, (data, status) => {
            if (status === 201) {
                this.toast.show('Успех', `Счёт "${data.accountName}" создан`, 'success');
                this.loadAccounts(); // перезагружаем список
            } else {
                this.toast.show('Ошибка', 'Не удалось создать счёт', 'danger');
            }
        });
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        document.getElementById('searchBtn').addEventListener('click', () => {
            const title = document.getElementById('searchInput').value;
            this.loadAccounts(title);
        });
        document.getElementById('addAccountBtn').addEventListener('click', () => this.addAccount());
        document.getElementById('goToGallery').addEventListener('click', async () => {
            const { GalleryPage } = await import('../gallery/index.js');
            new GalleryPage(this.parent).render();
        });

        this.loadAccounts(); // начальная загрузка
    }
}
