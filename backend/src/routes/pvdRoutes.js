const express = require('express');
const router = express.Router();
const db = require('../config/db');

// =========================================
// CRIAR PONTO DE VENDA (CESTÃO / GÔNDOLA)
// =========================================
router.post('/cadastrar', async (req, res) => {
  try {
    const { loja_id, tipo, nome } = req.body;

    if (!loja_id || !tipo || !nome) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const result = await db.query(
      `INSERT INTO pontos (loja_id, tipo, nome)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [loja_id, tipo, nome]
    );

    res.status(201).json({
      mensagem: 'Ponto criado com sucesso',
      ponto: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar ponto' });
  }
});

// =========================================
// LISTAR PONTOS POR LOJA
// =========================================
router.get('/loja/:loja_id', async (req, res) => {
  try {
    const { loja_id } = req.params;

    const result = await db.query(
      `SELECT * FROM pontos WHERE loja_id = $1`,
      [loja_id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar pontos' });
  }
});

// =========================================
// LISTAR TODOS
// =========================================
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM pontos`);
    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar pontos' });
  }
});

module.exports = router;