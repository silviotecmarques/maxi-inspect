const express = require('express');
const router = express.Router();
const db = require('../config/db');

// LISTAR EMPRESAS
router.get('/empresas', async (req, res) => {
  const result = await db.query('SELECT * FROM empresas');
  res.json(result.rows);
});

// CRIAR EMPRESA
router.post('/empresas', async (req, res) => {
  const { nome, cnpj } = req.body;

  const empresa = await db.query(
    'INSERT INTO empresas (nome, cnpj) VALUES ($1, $2) RETURNING *',
    [nome, cnpj]
  );

  res.json(empresa.rows[0]);
});

// CRIAR SUPERVISOR
router.post('/criar-supervisor', async (req, res) => {
  const { nome, email, pin, empresa_id } = req.body;

  const user = await db.query(`
    INSERT INTO usuarios (nome, email, pin, role, empresa_id)
    VALUES ($1, $2, $3, 'SUPERVISOR', $4)
    RETURNING *
  `, [nome, email, pin, empresa_id]);

  res.json(user.rows[0]);
});

module.exports = router;