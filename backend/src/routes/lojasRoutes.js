const express = require('express');
const router = express.Router();
const controller = require('../controllers/lojasController');

router.get('/', controller.listar);

module.exports = router;