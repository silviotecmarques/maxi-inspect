const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware'); // O segurança que criamos

// Rota para Cadastrar Empresa (Apenas MASTER pode)
router.post('/cadastrar', auth, async (req, res) => {
    const { nome, cnpj, estado, cidade } = req.body;

    // Bloqueio tático: Se não for MASTER, não cria empresa
    if (req.userRole !== 'MASTER') {
        return res.status(403).json({ erro: "Acesso negado. Apenas o MASTER pode criar empresas." });
    }

    try {
        const novaEmpresa = await db.query(
            'INSERT INTO empresas (nome, cnpj, estado, cidade) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, cnpj, estado, cidade]
        );

        res.json({ mensagem: "Empresa cadastrada com sucesso!", empresa: novaEmpresa.rows[0] });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao cadastrar empresa. CNPJ pode já existir." });
    }
});

module.exports = router;