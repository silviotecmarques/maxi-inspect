const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

// Rota para definir a quantidade de PVDs em uma loja
router.post('/configurar-loja', auth, async (req, res) => {
    const { loja_id, pvd_id, quantidade } = req.body;

    // Apenas quem manda na empresa ou o Master pode configurar
    if (req.userRole !== 'MASTER' && req.userRole !== 'GESTOR') {
        return res.status(403).json({ erro: "Sem permissão para configurar inventário." });
    }

    try {
        // Upsert: Se já existir esse PVD na loja, ele atualiza a quantidade. Se não, insere.
        const query = `
            INSERT INTO loja_pvd (loja_id, pvd_id, quantidade) 
            VALUES ($1, $2, $3)
            ON CONFLICT (loja_id, pvd_id) 
            DO UPDATE SET quantidade = EXCLUDED.quantidade
            RETURNING *;
        `;
        
        // Antes de rodar, precisamos garantir que o banco aguenta o conflito. 
        // Silvio, se der erro de "unique constraint", precisaremos rodar um comando no pgAdmin.
        const config = await db.query(
            'INSERT INTO loja_pvd (loja_id, pvd_id, quantidade) VALUES ($1, $2, $3) RETURNING *',
            [loja_id, pvd_id, quantidade]
        );

        res.json({ mensagem: "PVD configurado na loja!", dados: config.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao configurar PVD. Verifique se o pvd_id existe." });
    }
});

// Rota para ver o inventário da loja
router.get('/inventario/:loja_id', auth, async (req, res) => {
    const { loja_id } = req.params;

    try {
        const inventario = await db.query(
            `SELECT pt.tipo, lp.quantidade 
             FROM loja_pvd lp 
             JOIN pvd_tipos pt ON lp.pvd_id = pt.id 
             WHERE lp.loja_id = $1`,
            [loja_id]
        );
        res.json(inventario.rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar inventário." });
    }
});

module.exports = router;