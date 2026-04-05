const express = require('express');
const router = express.Router();

const tradesController = require('../controllers/tradesController');

router.get('/', tradesController.listar);
router.post('/', tradesController.criar);

module.exports = router;