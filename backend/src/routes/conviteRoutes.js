const express = require('express');
const router = express.Router();
const db = require('../config/db');

// =========================================
// GERAR CONVITE
// =========================================
router.post('/convite', async (req, res) => {
  try {
    const { email, role, empresa_id, loja_id } = req.body;

    const token = Math.random().toString(36).substring(2);

    await db.query(
      `INSERT INTO convites (email, role, empresa_id, loja_id, token)
       VALUES ($1,$2,$3,$4,$5)`,
      [email, role, empresa_id, loja_id, token]
    );

    res.json({
      link: `http://localhost:5500/cadastro.html?token=${token}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao gerar convite" });
  }
});

// =========================================
// CADASTRO VIA LINK
// =========================================
router.post('/cadastro', async (req, res) => {
  try {
    const { token, nome, senha } = req.body;

    const convite = await db.query(
      `SELECT * FROM convites WHERE token = $1 AND usado = false`,
      [token]
    );

    if (convite.rows.length === 0) {
      return res.status(400).json({ erro: "Convite inválido" });
    }

    const c = convite.rows[0];

    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await db.query(
      `INSERT INTO usuarios (nome, senha, pin, role, empresa_id, loja_id, email)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [nome, senha, pin, c.role, c.empresa_id, c.loja_id, c.email]
    );

    await db.query(
      `UPDATE convites SET usado = true WHERE id = $1`,
      [c.id]
    );

    res.json({
      mensagem: "Usuário criado com sucesso",
      pin
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro no cadastro" });
  }
});

module.exports = router;