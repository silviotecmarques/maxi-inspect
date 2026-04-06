const express = require('express');
const router = express.Router();
const db = require('../config/db');

// LISTAR PONTOS POR LOJA
router.get('/', async (req, res) => {
  const { loja_id } = req.query;

  try {
    const result = await db.query(
      'SELECT * FROM pontos WHERE loja_id = $1',
      [loja_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar pontos' });
  }
});

module.exports = router;