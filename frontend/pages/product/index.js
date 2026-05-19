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

    getData() {
        ajax.get(stockUrls.getStockById(this.id), (data, status) => {
            if (status === 200 && data) {
                this.renderData(data);
            } else {
                this.toast.show('Ошибка', 'Счёт не найден', 'danger');
                this.pageRoot.insertAdjacentHTML('beforeend', '<div class="alert alert-danger">Счёт не найден</div>');
            }
        });
    }

    renderData(item) {
    const product = new ProductComponent(this.pageRoot);
    product.render(item);
}

    get pageRoot() {
        return document.getElementById('product-page');
    }

    getHTML() {
        return `<div id="product-page" class="animated-page py-3"></div>`;
    }

    clickBack = () => {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    };

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backBtnHtml = `<button class="back-button" id="back-button"><i class="fas fa-chevron-left"></i> Назад к счетам</button>`;
        this.pageRoot.insertAdjacentHTML('afterbegin', backBtnHtml);
        document.getElementById('back-button').addEventListener('click', this.clickBack);

        this.getData();
    }
}
