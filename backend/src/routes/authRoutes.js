const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const SECRET = "maxi-secret";

// =========================================
// LOGIN POR PIN
// =========================================
router.post('/login-pin', async (req, res) => {
  try {
    const { pin } = req.body;

    const result = await db.query(
      `SELECT * FROM usuarios WHERE pin = $1`,
      [pin]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'PIN inválido' });
    }

    const user = result.rows[0];

    // 🔥 Se for supervisor → pede senha
    if (user.role === 'SUPERVISOR') {
      return res.json({
        precisaSenha: true,
        userId: user.id
      });
    }

    // 🔥 gera token direto
    const token = jwt.sign({
      id: user.id,
      role: user.role,
      empresa_id: user.empresa_id,
      loja_id: user.loja_id
    }, SECRET);

    res.json({ token, usuario: user });

  } catch (err) {
    res.status(500).json({ erro: "Erro login" });
  }
});

// =========================================
// LOGIN COM SENHA (SUPERVISOR)
// =========================================
router.post('/login-senha', async (req, res) => {
  try {
    const { userId, senha } = req.body;

    const result = await db.query(
      `SELECT * FROM usuarios WHERE id = $1 AND senha = $2`,
      [userId, senha]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Senha inválida' });
    }

    const user = result.rows[0];

    const token = jwt.sign({
      id: user.id,
      role: user.role,
      empresa_id: user.empresa_id
    }, SECRET);

    res.json({ token, usuario: user });

  } catch (err) {
    res.status(500).json({ erro: "Erro login" });
  }
});

module.exports = router;