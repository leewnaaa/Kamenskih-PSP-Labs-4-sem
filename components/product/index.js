export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    // Функция вычисления оставшихся дней до окончания срока
    getDaysLeft(expiry) {
        if (!expiry || expiry === '—') return null;
        // expiry имеет формат "MM/YY"
        const [month, year] = expiry.split('/');
        // текущая дата
        const now = new Date();
        // дата окончания: первое число следующего месяца после expiry
        // (срок действует до последнего дня указанного месяца)
        const expiryDate = new Date(2000 + parseInt(year), parseInt(month), 0); // последний день месяца
        // разница в днях
        const diffTime = expiryDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    // Получение стиля и текста для предупреждения
    getWarningInfo(expiry) {
        const daysLeft = this.getDaysLeft(expiry);
        if (daysLeft === null) return null;
        if (daysLeft < 0) {
            return { text: '⚠️ Срок действия истёк!', class: 'text-danger fw-bold' };
        } else if (daysLeft <= 30) {
            return { text: `⚠️ Срок истекает через ${daysLeft} дней!`, class: 'text-danger fw-bold' };
        } else if (daysLeft <= 90) {
            return { text: `ℹ️ Срок истекает через ${daysLeft} дней (через ${Math.ceil(daysLeft/30)} мес.)`, class: 'text-warning' };
        }
        return { text: `✅ Срок действия действителен ещё ${daysLeft} дней`, class: 'text-success' };
    }

    getHTML(data) {
        const expiryWarning = this.getWarningInfo(data.expiry);
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
                    ${expiryWarning ? `<div class="alert alert-${expiryWarning.class.includes('danger') ? 'danger' : (expiryWarning.class.includes('warning') ? 'warning' : 'info')} mt-2" role="alert">${expiryWarning.text}</div>` : ''}
                </div>
            </div>
        `;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
