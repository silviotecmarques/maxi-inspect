const express = require('express');
const router = express.Router();
const db = require('../config/db');

// =========================================
// CRIAR USUÁRIO
// =========================================
router.post('/cadastrar', async (req, res) => {
  try {
    const {
      nome,
      email,
      pin,
      role,
      empresa_id,
      loja_id
    } = req.body;

    if (!nome || !email || !pin || !role || !empresa_id) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const result = await db.query(
      `INSERT INTO usuarios 
      (nome, email, pin, role, empresa_id, loja_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [nome, email, pin, role, empresa_id, loja_id || null]
    );

    res.status(201).json({
      mensagem: 'Usuário criado com sucesso',
      usuario: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
});

// =========================================
// LISTAR USUÁRIOS POR EMPRESA
// =========================================
router.get('/empresa/:empresa_id', async (req, res) => {
  try {
    const { empresa_id } = req.params;

    const result = await db.query(
      `SELECT * FROM usuarios WHERE empresa_id = $1`,
      [empresa_id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar usuários' });
  }
});

// =========================================
// LISTAR TODOS
// =========================================
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM usuarios`);
    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar usuários' });
  }
});

module.exports = router;