const express = require('express');
const router = express.Router();
const db = require('../config/db');

// =========================================
// CRIAR LOJA
// =========================================
router.post('/cadastrar', async (req, res) => {
  try {
    const { nome, cidade, estado, cnpj, empresa_id } = req.body;

    if (!nome || !cidade || !estado || !cnpj || !empresa_id) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const result = await db.query(
      `INSERT INTO lojas (nome, cidade, estado, cnpj, empresa_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nome, cidade, estado, cnpj, empresa_id]
    );

    res.status(201).json({
      mensagem: 'Loja cadastrada com sucesso',
      loja: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar loja' });
  }
});

// =========================================
// LISTAR LOJAS POR EMPRESA
// =========================================
router.get('/empresa/:empresa_id', async (req, res) => {
  try {
    const { empresa_id } = req.params;

    const result = await db.query(
      `SELECT * FROM lojas WHERE empresa_id = $1`,
      [empresa_id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar lojas' });
  }
});

// =========================================
// LISTAR TODAS
// =========================================
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM lojas`);
    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar lojas' });
  }
});

module.exports = router;