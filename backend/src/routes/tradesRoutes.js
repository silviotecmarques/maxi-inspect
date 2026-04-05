const express = require('express');
const router = express.Router();

const tradesController = require('../controllers/tradesController');
const upload = require('../config/upload');

router.get('/', tradesController.listar);
router.post('/', upload.single('imagem'), tradesController.criar);

module.exports = router;