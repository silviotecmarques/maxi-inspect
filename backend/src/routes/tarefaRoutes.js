const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

// Rota para Criar Tarefa (GESTOR ou MASTER)
router.post('/criar', auth, async (req, res) => {
    const { loja_id, pvd_id, descricao, prazo } = req.body;

    if (req.userRole !== 'MASTER' && req.userRole !== 'GESTOR') {
        return res.status(403).json({ erro: "Acesso negado para criar tarefas." });
    }

    try {
        const novaTarefa = await db.query(
            `INSERT INTO tarefas (loja_id, pvd_id, descricao, prazo, criado_por, status) 
             VALUES ($1, $2, $3, $4, $5, 'pendente') RETURNING *`,
            [loja_id, pvd_id, descricao, prazo, req.userId]
        );

        res.json({ mensagem: "Tarefa enviada para o campo!", tarefa: novaTarefa.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao gerar tarefa." });
    }
});

// Rota para o PROMOTOR ver as tarefas DELE (da loja dele)
router.get('/minhas-tarefas', auth, async (req, res) => {
    try {
        // Se for Promotor, filtramos pela loja_id que está no TOKEN dele
        const tarefas = await db.query(
            `SELECT t.*, pt.tipo as pvd_nome 
             FROM tarefas t
             JOIN pvd_tipos pt ON t.pvd_id = pt.id
             WHERE t.loja_id = $1 AND t.status = 'pendente'`,
            [req.empresaId] // Aqui usaremos o ID da loja que injetamos no middleware
        );
        
        res.json(tarefas.rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar tarefas." });
    }
});

module.exports = router;