const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

// Rota para o PROMOTOR enviar a execução (FotoCheck)
router.post('/enviar', auth, async (req, res) => {
    const { tarefa_id, foto_url, observacao } = req.body;

    // Apenas Promotores podem executar (ou Master para testes)
    if (req.userRole !== 'PROMOTOR' && req.userRole !== 'MASTER') {
        return res.status(403).json({ erro: "Apenas promotores podem enviar execuções." });
    }

    try {
        // 1. Registrar a Execução no banco
        const novaExecucao = await db.query(
            `INSERT INTO execucoes (tarefa_id, usuario_id, foto_url, observacao) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [tarefa_id, req.userId, foto_url, observacao]
        );

        // 2. Atualizar o Status da Tarefa para 'concluido'
        await db.query(
            'UPDATE tarefas SET status = $1 WHERE id = $2',
            ['concluido', tarefa_id]
        );

        res.json({ 
            mensagem: "FotoCheck realizado com sucesso!", 
            dados: novaExecucao.rows[0] 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao processar execução." });
    }
});

// Rota para o GESTOR ver todas as execuções da empresa dele
router.get('/relatorio', auth, async (req, res) => {
    try {
        let query = `
            SELECT 
                e.id, 
                e.foto_url, 
                e.observacao, 
                e.criado_em as data_execucao,
                u.nome as promotor,
                l.nome as loja,
                t.descricao as tarefa,
                pt.tipo as pvd
            FROM execucoes e
            JOIN users u ON e.usuario_id = u.id
            JOIN tarefas t ON e.tarefa_id = t.id
            JOIN lojas l ON t.loja_id = l.id
            JOIN pvd_tipos pt ON t.pvd_id = pt.id
        `;
        
        let params = [];

        // Se for GESTOR, ele só vê execuções da EMPRESA dele
        if (req.userRole === 'GESTOR') {
            query += ' WHERE u.empresa_id = $1';
            params.push(req.empresaId);
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao gerar relatório de execuções." });
    }
});

module.exports = router;