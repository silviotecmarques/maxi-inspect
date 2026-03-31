const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

// Rota para Cadastrar Novo Usuário (Promotor/Auditor/Gestor)
router.post('/cadastrar', auth, async (req, res) => {
    const { nome, email, pin, role, empresa_id, loja_id } = req.body;

    // Segurança: Apenas Master ou Gestor criam usuários
    if (req.userRole !== 'MASTER' && req.userRole !== 'GESTOR') {
        return res.status(403).json({ erro: "Acesso negado." });
    }

    try {
        const novoUsuario = await db.query(
            `INSERT INTO users (nome, email, pin, role, empresa_id, loja_id) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, role, loja_id`,
            [nome, email, pin, role, empresa_id, loja_id]
        );

        res.json({ 
            mensagem: `${role} cadastrado com sucesso!`, 
            usuario: novoUsuario.rows[0] 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao cadastrar usuário. Email pode já existir." });
    }

    const crypto = require('crypto');

router.post('/convidar', auth, async (req, res) => {
    const { nome, email, role, empresa_id, loja_id } = req.body;

    try {
        // 1. Cria usuário inativo e sem PIN
        const novoUser = await db.query(
            `INSERT INTO users (nome, email, role, empresa_id, loja_id, ativo) 
             VALUES ($1, $2, $3, $4, $5, false) RETURNING id`,
            [nome, email, role, empresa_id, loja_id]
        );

        // 2. Gera Token Seguro (mínimo 32 caracteres) [cite: 19]
        const token = crypto.randomBytes(32).toString('hex');
        const expiraEm = new Date();
        expiraEm.setHours(expiraEm.getHours() + 24); // Expiração em 24h

        await db.query(
            'INSERT INTO user_invites (user_id, token, expira_em) VALUES ($1, $2, $3)',
            [novoUser.rows[0].id, token, expiraEm]
        );

        // 3. Simulação de envio de e-mail (O Link é a chave)
        const linkAtivacao = `https://maxiinspect.com.br/ativar?token=${token}`;
        
        console.log(`📧 E-mail enviado para ${email}: ${linkAtivacao}`);

        res.json({ mensagem: "Convite gerado com sucesso!", link: linkAtivacao });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao gerar convite." });
    }
});
});
router.get('/status-convites', auth, async (req, res) => {
    try {
        const status = await db.query(
            `SELECT u.nome, u.email, u.role, u.ativo, i.expira_em, i.usado 
             FROM users u 
             LEFT JOIN user_invites i ON u.id = i.user_id 
             WHERE u.empresa_id = $1`, 
            [req.empresaId]
        );
        res.json(status.rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar status" });
    }
});

module.exports = router;