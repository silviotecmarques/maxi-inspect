const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');
const crypto = require('crypto');

router.post('/convidar', auth, async (req, res) => {
    const { nome, email, role, empresa_id, loja_id } = req.body;

    try {
        const novoUser = await db.query(
            `INSERT INTO users (nome, email, role, empresa_id, loja_id, ativo) 
             VALUES ($1, $2, $3, $4, $5, false) RETURNING id`,
            [nome, email, role, empresa_id, loja_id]
        );

        const token = crypto.randomBytes(32).toString('hex');
        const expiraEm = new Date();
        expiraEm.setHours(expiraEm.getHours() + 24); 

        await db.query('INSERT INTO user_invites (user_id, token, expira_em) VALUES ($1, $2, $3)', 
            [novoUser.rows[0].id, token, expiraEm]);

        // Link apontando para a sua página de ativação
        const linkAtivacao = `http://127.0.0.1:5500/frontend/pages/ativar.html?token=${token}`;

        res.json({ mensagem: "Convite gerado!", link: linkAtivacao });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao convidar." });
    }
});

module.exports = router;