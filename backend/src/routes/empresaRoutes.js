const express = require('express');
const router = express.Router();
const db = require('../config/db');

// =========================================
// CRIAR EMPRESA
// =========================================
router.post('/cadastrar', async (req, res) => {
  try {
    const { nome, cnpj } = req.body;

    if (!nome || !cnpj) {
      return res.status(400).json({ erro: 'Nome e CNPJ são obrigatórios' });
    }

    const result = await db.query(
      `INSERT INTO empresas (nome, cnpj)
       VALUES ($1, $2)
       RETURNING *`,
      [nome, cnpj]
    );

    res.status(201).json({
      mensagem: 'Empresa cadastrada com sucesso',
      empresa: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar empresa' });
  }
});

// =========================================
// LISTAR EMPRESAS
// =========================================
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM empresas`);
    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar empresas' });
  }
});

module.exports = router;