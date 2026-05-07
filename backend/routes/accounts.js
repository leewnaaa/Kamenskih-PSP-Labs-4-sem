const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');

router.get('/', accountsController.getAll);
router.get('/:id', accountsController.getOne);
router.post('/', accountsController.create);
router.patch('/:id', accountsController.update);
router.delete('/:id', accountsController.remove);

module.exports = router;
