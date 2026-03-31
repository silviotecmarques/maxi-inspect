const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

// Rota para Cadastrar Loja (MASTER ou GESTOR podem)
router.post('/cadastrar', auth, async (req, res) => {
    const { nome, cnpj, cidade, estado, empresa_id } = req.body;

    // Bloqueio tático: Apenas Master ou Gestor daquela empresa podem criar lojas
    if (req.userRole !== 'MASTER' && req.userRole !== 'GESTOR') {
        return res.status(403).json({ erro: "Sem permissão para criar lojas." });
    }

    try {
        const novaLoja = await db.query(
            'INSERT INTO lojas (nome, cnpj, cidade, estado, empresa_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, cnpj, cidade, estado, empresa_id]
        );

        res.json({ mensagem: "Loja vinculada com sucesso!", loja: novaLoja.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao cadastrar loja." });
    }
});

// Rota para Listar Lojas (Filtrado por Empresa)
router.get('/minhas-lojas', auth, async (req, res) => {
    try {
        let query = 'SELECT * FROM lojas';
        let params = [];

        // Se for GESTOR, ele só vê as lojas da empresa DELE
        if (req.userRole === 'GESTOR') {
            query += ' WHERE empresa_id = $1';
            params.push(req.empresaId);
        }

        const lojas = await db.query(query, params);
        res.json(lojas.rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar lojas." });
    }
});

module.exports = router;