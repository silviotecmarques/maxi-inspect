const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || "maxi-secret";

// =========================================
// LOGIN COM PIN
// =========================================
router.post('/login-pin', async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ erro: 'PIN obrigatório' });
    }

    const user = await db.query(
      'SELECT * FROM usuarios WHERE pin = $1',
      [pin]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ erro: 'PIN inválido' });
    }

    const u = user.rows[0];

    // MASTER e SUPERVISOR precisam de senha
    if (u.role === 'MASTER' || u.role === 'SUPERVISOR') {
      return res.json({
        precisaSenha: true,
        userId: u.id
      });
    }

    const token = jwt.sign(
      {
        id: u.id,
        role: u.role,
        empresa_id: u.empresa_id,
        loja_id: u.loja_id
      },
      SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      usuario: {
        id: u.id,
        nome: u.nome,
        role: u.role,
        empresa_id: u.empresa_id,
        loja_id: u.loja_id
      }
    });

  } catch (err) {
    console.error("Erro login PIN:", err);
    res.status(500).json({ erro: 'Erro no login PIN' });
  }
});


// =========================================
// LOGIN COM SENHA
// =========================================
router.post('/login-senha', async (req, res) => {
  try {
    const { userId, senha } = req.body;

    if (!userId || !senha) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }

    const user = await db.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const u = user.rows[0];

    if (u.senha !== senha) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    const token = jwt.sign(
      {
        id: u.id,
        role: u.role,
        empresa_id: u.empresa_id,
        loja_id: u.loja_id
      },
      SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      usuario: {
        id: u.id,
        nome: u.nome,
        role: u.role,
        empresa_id: u.empresa_id,
        loja_id: u.loja_id
      }
    });

  } catch (err) {
    console.error("Erro login senha:", err);
    res.status(500).json({ erro: 'Erro no login senha' });
  }
});

module.exports = router;