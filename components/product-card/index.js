export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="card mb-3" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${data.accountName}</h5>
                    <p class="card-text">Баланс: ${data.balance} ₽</p>
                    <p class="card-text">Номер счета: ${data.accountNumber}</p>
                    <button class="btn btn-primary" id="click-card-${data.id}" data-id="${data.id}">Подробнее</button>
                </div>
            </div>
        `;
    }

    addListeners(data, listener) {
        document.getElementById(`click-card-${data.id}`).addEventListener("click", listener);
    }

    render(data, listener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, listener);
    }
}
