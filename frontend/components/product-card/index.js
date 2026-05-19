export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        const maskedNumber = data.accountNumber;
        return `
            <div class="col-md-4 col-sm-6 mb-4">
                <div class="account-card">
                    <div class="card-header-red">
                        <i class="fas fa-credit-card me-1"></i> ${data.accountName}
                    </div>
                    <div class="card-body-custom">
                        <small class="text-muted">Баланс</small>
                        <div class="account-balance">${data.balance.toLocaleString()} ₽</div>
                        <div class="account-number"><i class="far fa-credit-card"></i> ${maskedNumber}</div>
                        <div class="mt-2"><small>Срок действия: ${data.expiry || '—'}</small></div>
                    </div>
                    <div class="card-footer-custom">
                        <button class="btn btn-alfa w-100" id="click-card-${data.id}" data-id="${data.id}">
                            <i class="fas fa-arrow-right me-1"></i> Подробнее
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    addListeners(data, listener) {
        const btn = document.getElementById(`click-card-${data.id}`);
        if (btn) btn.addEventListener("click", listener);
    }

    render(data, listener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, listener);
    }
}
