export class ProductComponent {
    constructor(parent, toastCallback) {
        this.parent = parent;
        this.toast = toastCallback;
    }

    getHTML(data) {
        return `
            <div class="detail-card">
                <div class="detail-header">
                    <i class="fas fa-university fa-2x"></i>
                    <h3 class="mt-2">${data.accountName}</h3>
                </div>
                <div class="detail-body">
                    <table class="table table-borderless">
                        <tr><td><i class="fas fa-id-card"></i> Номер счёта</td><td><strong>${data.accountNumber}</strong></td></tr>
                        <tr><td><i class="fas fa-ruble-sign"></i> Баланс</td><td><strong class="text-danger fs-4">${data.balance.toLocaleString()} ₽</strong></td></tr>
                        <tr><td><i class="fas fa-chart-line"></i> Тип</td><td>${data.type}</td></tr>
                        ${data.creditLimit ? `<tr><td><i class="fas fa-credit-card"></i> Кредитный лимит</td><td>${data.creditLimit}</td></tr>` : ''}
                        ${data.percent ? `<tr><td><i class="fas fa-percent"></i> Ставка</td><td>${data.percent}</td></tr>` : ''}
                        <tr><td><i class="far fa-calendar-alt"></i> Срок действия</td><td>${data.expiry}</td></tr>
                    </table>
                </div>
            </div>
        `;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
