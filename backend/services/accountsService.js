const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = (title) => {
    const accounts = fileService.readData(dataFilePath);
    if (title) {
        return accounts.filter(acc =>
            acc.accountName.toLowerCase().includes(title.toLowerCase())
        );
    }
    return accounts;
};

const findOne = (id) => {
    const accounts = fileService.readData(dataFilePath);
    return accounts.find(acc => acc.id === id);
};

const create = (accountData) => {
    const accounts = fileService.readData(dataFilePath);
    const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    const newAccount = { id: newId, ...accountData };
    accounts.push(newAccount);
    fileService.writeData(dataFilePath, accounts);
    return newAccount;
};

const update = (id, accountData) => {
    const accounts = fileService.readData(dataFilePath);
    const index = accounts.findIndex(a => a.id === id);
    if (index === -1) return null;
    accounts[index] = { ...accounts[index], ...accountData };
    fileService.writeData(dataFilePath, accounts);
    return accounts[index];
};

const remove = (id) => {
    const accounts = fileService.readData(dataFilePath);
    const filtered = accounts.filter(a => a.id !== id);
    if (filtered.length === accounts.length) return false;
    fileService.writeData(dataFilePath, filtered);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };
