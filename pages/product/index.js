import { ProductComponent } from "../../components/product/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { ToastComponent } from "../../components/toast/index.js";

export class ProductPage {
    constructor(parent, id, toastInstance = null) {
        this.parent = parent;
        this.id = id;
        // Если toast не передан, создаём новый (на случай прямого вызова)
        this.toast = toastInstance || new ToastComponent(document.querySelector('.toast-container'));
    }

    getData() {
        // Эмуляция данных с сервера по id
        const accounts = {
            1: { accountName: "Дебетовая карта", accountNumber: "**** 1234", balance: 12500, bank: "Тинькофф", type: "Дебетовая" },
            2: { accountName: "Кредитная карта", accountNumber: "**** 5678", balance: 50000, bank: "Сбербанк", type: "Кредитная" },
            3: { accountName: "Накопительный счет", accountNumber: "**** 9012", balance: 300000, bank: "Альфа-Банк", type: "Накопительный" }
        };
        return accounts[this.id] || accounts[1];
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    getHTML() {
        return `<div id="product-page" class="p-3"></div>`;
    }

    clickBack = () => {

        const mainPage = new MainPage(this.parent);
        mainPage.render();
    };

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack);

        const data = this.getData();
        const product = new ProductComponent(this.pageRoot);
        product.render(data);


    }
}
