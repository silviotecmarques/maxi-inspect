const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/login-pin', async (req, res) => {
  try {
    const { pin } = req.body;

    const user = await db.query(
      'SELECT * FROM usuarios WHERE pin = $1',
      [pin]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ erro: 'PIN inválido' });
    }

    const u = user.rows[0];

    if (u.role === 'MASTER' || u.role === 'SUPERVISOR') {
      return res.json({
        precisaSenha: true,
        userId: u.id
      });
    }

    return res.json({
      token: 'fake-token',
      usuario: {
        id: u.id,
        nome: u.nome,
        role: u.role,
        empresa_id: u.empresa_id,
        loja_id: u.loja_id
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no login PIN' });
  }
});

router.post('/login-senha', async (req, res) => {
  try {
    const { userId, senha } = req.body;

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

    return res.json({
      token: 'fake-token',
      usuario: {
        id: u.id,
        nome: u.nome,
        role: u.role,
        empresa_id: u.empresa_id,
        loja_id: u.loja_id
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no login senha' });
  }
});

module.exports = router;