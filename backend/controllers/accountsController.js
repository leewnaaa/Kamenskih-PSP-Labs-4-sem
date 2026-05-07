const accountsService = require('../services/accountsService');

const getAll = (req, res) => {
    const { title } = req.query;
    const accounts = accountsService.findAll(title);
    res.json(accounts);
};

const getOne = (req, res) => {
    const id = parseInt(req.params.id);
    const account = accountsService.findOne(id);
    if (!account) return res.status(404).json({ error: 'Счёт не найден' });
    res.json(account);
};

const create = (req, res) => {
    const { accountName, accountNumber, balance, type, expiry, creditLimit, percent } = req.body;
    if (!accountName || !accountNumber || balance === undefined || !type) {
        return res.status(400).json({ error: 'Не все обязательные поля заполнены' });
    }
    const newAccount = accountsService.create({ accountName, accountNumber, balance, type, expiry, creditLimit, percent });
    res.status(201).json(newAccount);
};

const update = (req, res) => {
    const id = parseInt(req.params.id);
    const updated = accountsService.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Счёт не найден' });
    res.json(updated);
};

const remove = (req, res) => {
    const id = parseInt(req.params.id);
    const success = accountsService.remove(id);
    if (!success) return res.status(404).json({ error: 'Счёт не найден' });
    res.status(204).send();
};

module.exports = { getAll, getOne, create, update, remove };
