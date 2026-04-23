import { ProductComponent } from "../../components/product/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { ToastComponent } from "../../components/toast/index.js";

export class ProductPage {
    constructor(parent, id, toastInstance = null) {
        this.parent = parent;
        this.id = id;
        this.toast = toastInstance || new ToastComponent();
    }

    getData() {
        const accounts = {
            1: {
                accountName: "Дебетовая карта Premium",
                accountNumber: "5536 9148 2345 6789",
                balance: 125_800,
                type: "Дебетовая",
                expiry: "08/28",
                creditLimit: null
            },
            2: {
                accountName: "Кредитная карта 100 дней",
                accountNumber: "4276 8901 2345 1112",
                balance: 50_000,
                type: "Кредитная",
                expiry: "03/26",
                creditLimit: "150 000 ₽"
            },
            3: {
                accountName: "Накопительный счёт",
                accountNumber: "4081 7810 9023 4567",
                balance: 450_300,
                type: "Сберегательный",
                expiry: "—",
                percent: "6%"
            }
        };
        return accounts[this.id] || accounts[1];
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    getHTML() {
        return `<div id="product-page" class="animated-page py-3"></div>`;
    }

    clickBack = () => {
        this.toast.show("Навигация", "Возврат на главную страницу", "success");
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    };

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        // Кнопка назад
        const backBtnHtml = `<button class="back-button" id="back-button"><i class="fas fa-chevron-left"></i> Назад к счетам</button>`;
        this.pageRoot.insertAdjacentHTML('afterbegin', backBtnHtml);
        document.getElementById('back-button').addEventListener('click', this.clickBack);

        const data = this.getData();
        const product = new ProductComponent(this.pageRoot);
        product.render(data);

        this.toast.show("Информация по счёту", `Вы просматриваете "${data.accountName}"`, "info");
    }
}
