const express = require('express');
const router = express.Router();

const controller = require('../controllers/tradesController');
const upload = require('../config/upload');

router.get('/', controller.listar);
router.post('/', upload.single('imagem'), controller.criar);
router.put('/aprovar-industria/:id', controller.aprovarIndustria);
router.put('/aprovar-supervisor/:id', controller.aprovarSupervisor);
router.put('/reprovar/:id', controller.reprovar);

module.exports = router;