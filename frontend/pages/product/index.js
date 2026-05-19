import { ajax } from "../../modules/ajax.js";
import { stockUrls } from "../../modules/stockUrls.js";
import { ProductComponent } from "../../components/product/index.js";
import { MainPage } from "../main/index.js";
import { ToastComponent } from "../../components/toast/index.js";

export class ProductPage {
    constructor(parent, id, toastInstance = null) {
        this.parent = parent;
        this.id = id;
        this.toast = toastInstance || new ToastComponent();
    }

    async getData() {
        try {
            const data = await ajax.get(stockUrls.getStockById(this.id));
            return data;
        } catch (err) {
            this.toast.show('Ошибка', 'Счёт не найден', 'danger');
            return null;
        }
    }

    get pageRoot() { return document.getElementById('product-page'); }

    getHTML() {
        return `<div id="product-page" class="animated-page py-3"></div>`;
    }

    clickBack = () => {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    };

    async render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backBtnHtml = `<button class="back-button" id="back-button"><i class="fas fa-chevron-left"></i> Назад к счетам</button>`;
        this.pageRoot.insertAdjacentHTML('afterbegin', backBtnHtml);
        document.getElementById('back-button').addEventListener('click', this.clickBack);

        const data = await this.getData();
        if (data) {
            const product = new ProductComponent(this.pageRoot);
            product.render(data);

        } else {
            this.pageRoot.insertAdjacentHTML('beforeend', '<div class="alert alert-danger">Счёт не найден</div>');
        }
    }
}
