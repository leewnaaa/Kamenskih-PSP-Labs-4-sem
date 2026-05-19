class Ajax {
    /**
     * GET-запрос
     * @param {string} url
     * @returns {Promise<any>} – промис с данными ответа
     */
    async get(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    }

    /**
     * POST-запрос
     * @param {string} url
     * @param {object} data
     * @returns {Promise<any>}
     */
    async post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    }

// PATCH-запрос
    async patch(url, data) {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    }


//DELETE-запрос

    async delete(url) {
        const response = await fetch(url, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        // для 204 No Content ответа может не быть
        if (response.status !== 204) {
            return await response.json();
        }
        return null;
    }
}

export const ajax = new Ajax();
