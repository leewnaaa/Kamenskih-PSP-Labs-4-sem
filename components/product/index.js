export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="card" style="width: 30rem;">
                <div class="card-body">
                    <h3 class="card-title">${data.accountName}</h3>
                    <p class="card-text"><strong>Банк:</strong> ${data.bank}</p>
                    <p class="card-text"><strong>Тип счета:</strong> ${data.type}</p>
                    <p class="card-text"><strong>Номер:</strong> ${data.accountNumber}</p>
                    <p class="card-text display-6">${data.balance} ₽</p>
                </div>
            </div>
        `;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
