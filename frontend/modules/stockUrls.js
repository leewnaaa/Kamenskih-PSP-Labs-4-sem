class StockUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    getStocks() {
        return `${this.baseUrl}/api/accounts`;
    }

    getStockById(id) {
        return `${this.baseUrl}/api/accounts/${id}`;
    }

    createStock() {
        return `${this.baseUrl}/api/accounts`;
    }

    removeStockById(id) {
        return `${this.baseUrl}/api/accounts/${id}`;
    }

    updateStockById(id) {
        return `${this.baseUrl}/api/accounts/${id}`;
    }
}

export const stockUrls = new StockUrls();
