const express = require('express');
const router = express.Router();

const controller = require('../controllers/tradesController');
const upload = require('../config/upload');

const { verificarToken, verificarRole } = require('../middlewares/authMiddleware');

// =========================================
// ROTAS PROTEGIDAS
// =========================================

// LISTAR TRADES (Supervisor / Indústria)
router.get(
  '/',
  verificarToken,
  verificarRole(['SUPERVISOR', 'INDUSTRIA']),
  controller.listar
);

// CRIAR TRADE (Supervisor)
router.post(
  '/',
  verificarToken,
  verificarRole(['SUPERVISOR']),
  upload.single('imagem'),
  controller.criar
);

// APROVAR INDUSTRIA
router.put(
  '/aprovar-industria/:id',
  verificarToken,
  verificarRole(['INDUSTRIA']),
  controller.aprovarIndustria
);

// APROVAR SUPERVISOR
router.put(
  '/aprovar-supervisor/:id',
  verificarToken,
  verificarRole(['SUPERVISOR']),
  controller.aprovarSupervisor
);

// REPROVAR (Supervisor + Indústria)
router.put(
  '/reprovar/:id',
  verificarToken,
  verificarRole(['SUPERVISOR', 'INDUSTRIA']),
  controller.reprovar
);

module.exports = router;