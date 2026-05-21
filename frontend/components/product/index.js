// components/product/index.js
export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    /**
     * Вычисляет количество дней до окончания срока действия карты
     * @param {string} expiry - строка вида "MM/YY" или "—"
     * @returns {number|null} количество дней (положительное, если ещё не истёк; отрицательное, если истёк; null если срока нет)
     */
    getDaysLeft(expiry) {
        if (!expiry || expiry === '—') return null;
        const [month, year] = expiry.split('/');
        if (!month || !year) return null;

        const currentDate = new Date();
        // Дата окончания – последний день указанного месяца
        const expiryDate = new Date(2000 + parseInt(year), parseInt(month), 0);
        // Обнуляем время для корректного сравнения
        expiryDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        const diffTime = expiryDate - currentDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    /**
     * Возвращает HTML-блок с предупреждением о сроке действия
     * @param {string} expiry
     * @returns {string} HTML строка или пустая строка, если срок не задан
     */
    getExpiryWarning(expiry) {
        const daysLeft = this.getDaysLeft(expiry);
        if (daysLeft === null) return '';

        if (daysLeft < 0) {
            return `<div class="alert alert-danger mt-3" role="alert">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Срок действия карты истёк ${Math.abs(daysLeft)} дней назад!</strong>
                        <br>Обратитесь в банк для перевыпуска.
                    </div>`;
        } else if (daysLeft === 0) {
            return `<div class="alert alert-warning mt-3" role="alert">
                        <i class="fas fa-hourglass-end"></i>
                        <strong>Срок действия истекает сегодня!</strong>
                        <br>Рекомендуем заказать новую карту.
                    </div>`;
        } else if (daysLeft <= 30) {
            return `<div class="alert alert-warning mt-3" role="alert">
                        <i class="fas fa-hourglass-half"></i>
                        <strong>Срок действия истекает через ${daysLeft} дней!</strong>
                        <br>Скоро потребуется перевыпуск.
                    </div>`;
        } else if (daysLeft <= 90) {
            return `<div class="alert alert-info mt-3" role="alert">
                        <i class="fas fa-clock"></i>
                        Срок действия действителен ещё ${daysLeft} дней (около ${Math.ceil(daysLeft/30)} месяцев).
                    </div>`;
        } else {
            return `<div class="alert alert-success mt-3" role="alert">
                        <i class="fas fa-check-circle"></i>
                        Срок действия действителен ещё ${daysLeft} дней.
                    </div>`;
        }
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
                        <tr><td><i class="far fa-calendar-alt"></i> Срок действия</td><td>${data.expiry || '—'}</td></tr>
                    </table>
                    ${this.getExpiryWarning(data.expiry)}
                </div>
            </div>
        `;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}
