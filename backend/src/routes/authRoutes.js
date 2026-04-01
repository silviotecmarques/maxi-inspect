const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Ajuste o caminho se necessário

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // 1. Busca o usuário e a qual loja ele pertence
        const userQuery = await pool.query(
            `SELECT id, nome, email, senha_hash, role, filial_cnpj 
             FROM usuarios WHERE email = $1`,
            [email]
        );

        if (userQuery.rows.length === 0) {
            return res.status(401).json({ erro: 'Credenciais inválidas.' });
        }

        const usuario = userQuery.rows[0];

        // 2. Verifica a blindagem da senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Credenciais inválidas.' });
        }

        // 3. A INJEÇÃO TÁTICA: O payload do Token
        // É aqui que o "crachá" do gerente é carimbado com o CNPJ dele.
        const tokenPayload = {
            id: usuario.id,
            role: usuario.role,
            filial_cnpj: usuario.filial_cnpj // <-- O Cadeado de Segurança
        };

        // Assina o token (Duração de 12 horas para cobrir o turno da loja)
        const token = jwt.sign(
            tokenPayload, 
            process.env.JWT_SECRET || 'chave_tatic_maxi_inspect', 
            { expiresIn: '12h' } 
        );

        res.json({
            mensagem: 'Acesso autorizado.',
            token,
            usuario: {
                nome: usuario.nome,
                role: usuario.role,
                filial_cnpj: usuario.filial_cnpj
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ erro: 'Falha interna no servidor.' });
    }
});

module.exports = router;