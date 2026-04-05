const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verificarToken, verificarRole } = require('../middlewares/authMiddleware');

// =========================================
// DASHBOARD SUPERVISOR
// =========================================
router.get('/supervisor',
  verificarRole(['SUPERVISOR', 'MASTER']),
  async (req, res) => {
    try {

      const result = await db.query(`
        SELECT 
          l.id,
          l.nome,
          l.tipo,

          COUNT(e.id) FILTER (WHERE e.status = 'PENDENTE') as pendentes,
          COUNT(e.id) FILTER (WHERE e.status = 'APROVADO_SUP') as aprovados_sup,
          COUNT(e.id) FILTER (WHERE e.status = 'APROVADO_IND') as aprovados_ind

        FROM lojas l
        LEFT JOIN execucoes e ON e.loja_id = l.id
        GROUP BY l.id
        ORDER BY l.nome
      `);

      res.json(result.rows);

    } catch (err) {
      res.status(500).json({ erro: 'Erro no dashboard' });
    }
});

module.exports = router;