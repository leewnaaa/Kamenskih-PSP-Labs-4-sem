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
        const res = await fetch(`http://localhost:3000/api/accounts/${this.id}`);
        if (!res.ok) return null;
        return res.json();
    }

    get pageRoot() { return document.getElementById('product-page'); }
    getHTML() { return `<div id="product-page" class="animated-page py-3"></div>`; }

    clickBack = () => {

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
        if (!data) {
            this.pageRoot.insertAdjacentHTML('beforeend', '<div class="alert alert-danger">Счёт не найден</div>');
            return;
        }

        const product = new ProductComponent(this.pageRoot, (title, msg, type) => this.toast.show(title, msg, type));
        product.render(data, this.id);
        this.toast.show("Информация по счёту", `Вы просматриваете "${data.accountName}"`, "info");
    }
}
