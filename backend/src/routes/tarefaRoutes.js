const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verificarToken, verificarRole } = require('../middlewares/authMiddleware');

// =========================================
// CRIAR TAREFA
// =========================================
router.post('/criar',
  verificarToken,
  verificarRole(['SUPERVISOR', 'MASTER']),
  async (req, res) => {
    try {
      const { titulo, descricao, produto, data_limite } = req.body;

      const result = await db.query(
        `INSERT INTO tarefas 
        (titulo, descricao, produto, data_limite, criado_por, empresa_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          titulo,
          descricao,
          produto,
          data_limite,
          req.user.id,
          req.user.empresa_id
        ]
      );

      res.json(result.rows[0]);

    } catch (err) {
      res.status(500).json({ erro: "Erro ao criar tarefa" });
    }
});

module.exports = router;

// =========================================
// LISTAR TAREFAS
// =========================================
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM tarefas`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar tarefas' });
  }
});

// =========================================
// LISTAR TAREFAS POR LOJA
// =========================================
router.get('/loja/:loja_id',
  verificarRole(['PROMOTOR', 'SUPERVISOR', 'MASTER']),
  async (req, res) => {
    try {
      const { loja_id } = req.params;

      const result = await db.query(
        `SELECT * FROM tarefas WHERE empresa_id = 1 ORDER BY created_at DESC`
      );

      res.json(result.rows);

    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar tarefas' });
    }
});

module.exports = router;