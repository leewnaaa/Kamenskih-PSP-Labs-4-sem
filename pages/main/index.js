import { ProductCardComponent } from "../../components/product-card/index.js";
import { ProductPage } from "../product/index.js";
import { ToastComponent } from "../../components/toast/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.toast = new ToastComponent();
    }

    getData() {
        return [
            {
                id: 1,
                accountName: "Дебетовая карта Premium",
                accountNumber: "5536 9148 2345 6789",
                balance: 125_800,
                type: "Дебетовая",
                expiry: "08/28",
                bgColor: "white"
            },
            {
                id: 2,
                accountName: "Кредитная карта 100 дней",
                accountNumber: "4276 8901 2345 1112",
                balance: 50_000,
                type: "Кредитная",
                expiry: "03/26",
                creditLimit: "150 000 ₽"
            },
            {
                id: 3,
                accountName: "Накопительный счёт",
                accountNumber: "4081 7810 9023 4567",
                balance: 450_300,
                type: "Сберегательный",
                expiry: "—",
                percent: "6%"
            }
        ];
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `<div id="main-page" class="row g-4 animated-page"></div>`;
    }

    clickCard = (e) => {
        const cardId = e.target.closest('button').dataset.id;
        this.toast.show("Переход", `Открыт счёт №${cardId}`, "primary");
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
