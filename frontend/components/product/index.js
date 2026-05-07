import { sumDiagonals } from "../../utils/matrix.js";
import { flatten } from "../../utils/flatten.js";

export class ProductComponent {
    constructor(parent, toastCallback) {
        this.parent = parent;
        this.toast = toastCallback;
    }

    getMatrixForAccount(accountId) {
        const matrices = {
            1: [[1,2,3], [4,5,6], [7,8,9]],
            2: [[2,4,6], [8,10,12], [14,16,18]],
            3: [[5,0,0], [0,5,0], [0,0,5]]
        };
        return matrices[accountId] || [[1,2,3], [4,5,6], [7,8,9]];
    }

    getNestedOperations() {
        return [1, 2, 3, [4, 5, 6, [10, 20, 30]], [100, [200]]];
    }

    handleSumDiagonals(accountId) {
        const matrix = this.getMatrixForAccount(accountId);
        const result = sumDiagonals(matrix);
        this.toast("Сумма диагоналей", `Результат = ${result}`, "primary");
    }

    handleFlatten() {
        const nested = this.getNestedOperations();
        const flat = flatten(nested);
        this.toast("Flatten операций", `[${flat.join(", ")}]`, "info");
    }

    getHTML(data, accountId) {
        const matrix = this.getMatrixForAccount(accountId);
        const matrixPreview = matrix.map(row => `[${row.join(", ")}]`).join(" ");
        const nestedPreview = "[1, 2, 3, [4, 5, 6, [10, 20, 30]], [100, [200]]]";
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
                    <hr>
                    <h5><i class="fas fa-chart-simple"></i> Анализ матрицы транзакций</h5>
                    <p>Матрица расходов (3×3):<br>${matrixPreview}</p>
                    <button class="btn btn-outline-alfa btn-sm" id="sumDiagBtn">Вычислить сумму диагоналей</button>
                    <hr class="mt-3">
                    <h5><i class="fas fa-code-branch"></i> Вложенные операции</h5>
                    <p>Исходный массив:<br><code>${nestedPreview}</code></p>
                    <button class="btn btn-outline-alfa btn-sm" id="flattenBtn">Преобразовать в плоский список (flatten)</button>
                </div>
            </div>
        `;
    }

    addListeners(accountId) {
        const sumBtn = document.getElementById("sumDiagBtn");
        if (sumBtn) sumBtn.addEventListener("click", () => this.handleSumDiagonals(accountId));
        const flatBtn = document.getElementById("flattenBtn");
        if (flatBtn) flatBtn.addEventListener("click", () => this.handleFlatten());
    }

    render(data, accountId) {
        const html = this.getHTML(data, accountId);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(accountId);
    }
}
