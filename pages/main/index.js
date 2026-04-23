import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";
import { ToastComponent } from "../../components/toast/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.toastContainer = document.querySelector('.toast-container');
        this.toast = new ToastComponent(this.toastContainer);
    }

    getData() {
        return [
            { id: 1, accountName: "Дебетовая карта", accountNumber: "**** 1234", balance: 12500 },
            { id: 2, accountName: "Кредитная карта", accountNumber: "**** 5678", balance: 50000 },
            { id: 3, accountName: "Накопительный счет", accountNumber: "**** 9012", balance: 300000 }
        ];
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `<div id="main-page" class="d-flex flex-wrap gap-3 p-3"></div>`;
    }

    clickCard = (e) => {
        const cardId = e.target.dataset.id;

        const productPage = new ProductPage(this.parent, cardId, this.toast);
        productPage.render();
    };

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const data = this.getData();
        data.forEach(item => {
            const card = new ProductCardComponent(this.pageRoot);
            card.render(item, this.clickCard);
        });
    }
}
