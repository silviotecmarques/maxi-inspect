const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { email, pin } = req.body;

    try {
        let userQuery;

        // LÓGICA HÍBRIDA: IDENTIFICA O TIPO DE ACESSO
        if (email) {
            // 1. ACESSO VIA PAINEL ADMIN (Email + PIN/Senha)
            // Usado por MASTER e GESTOR
            userQuery = await db.query(
                'SELECT id, nome, email, role, empresa_id, loja_id FROM users WHERE email = $1 AND pin = $2 AND ativo = true',
                [email, pin]
            );
        } else {
            // 2. ACESSO VIA PDV / FOTOCHECK (Apenas PIN)
            // Usado por PROMOTOR e AUDITOR no campo
            userQuery = await db.query(
                'SELECT id, nome, email, role, empresa_id, loja_id FROM users WHERE pin = $1 AND ativo = true',
                [pin]
            );
        }

        // Validação de segurança
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ erro: "Credenciais inválidas ou usuário inativo." });
        }

        const user = userQuery.rows[0];

        // GERAÇÃO DO TOKEN JWT (O Crachá Digital)
        // Incluímos todas as informações de contexto para as rotas futuras
        const token = jwt.sign(
            { 
                id: user.id, 
                role: user.role, 
                empresa_id: user.empresa_id, 
                loja_id: user.loja_id 
            },
            process.env.JWT_SECRET,
            { expiresIn: '12h' } // Token válido por uma jornada de trabalho
        );

        // Resposta de Sucesso
        res.json({
            mensagem: `Bem-vindo, ${user.nome}!`,
            token,
            user: {
                nome: user.nome,
                role: user.role,
                empresa_id: user.empresa_id,
                loja_id: user.loja_id
            }
        });

        const bcrypt = require('bcryptjs');

router.post('/ativar', async (req, res) => {
    const { token, pin } = req.body;

    try {
        // 1. Valida o token e expiração
        const invite = await db.query(
            'SELECT * FROM user_invites WHERE token = $1 AND usado = false AND expira_em > NOW()',
            [token]
        );

        if (invite.rows.length === 0) return res.status(400).json({ erro: "Token inválido ou expirado" });

        // 2. Hash do PIN (Segurança Extrema - Nunca salvar puro) [cite: 14]
        const salt = await bcrypt.genSalt(10);
        const pinHash = await bcrypt.hash(pin, salt);

        // 3. Ativa usuário e marca token como usado
        await db.query('UPDATE users SET pin = $1, ativo = true WHERE id = $2', [pinHash, invite.rows[0].user_id]);
        await db.query('UPDATE user_invites SET usado = true WHERE token = $1', [token]);

        res.json({ mensagem: "Conta ativada com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao ativar conta." });
    }
});

    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ erro: "Erro interno no servidor ao processar login." });
    }
});

module.exports = router;