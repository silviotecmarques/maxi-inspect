const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(403).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    try {
        // Limpa o prefixo padrão do protocolo HTTP
        const tokenLimpo = token.replace('Bearer ', '');
        
        // Descriptografa o token
        const decodificado = jwt.verify(tokenLimpo, process.env.JWT_SECRET || 'chave_tatic_maxi_inspect');
        
        // INJEÇÃO CRÍTICA: A partir daqui, qualquer rota (ex: execucaoRoutes.js)
        // pode usar "req.usuario.filial_cnpj" para filtrar as queries SQL.
        req.usuario = decodificado;
        
        next();
    } catch (error) {
        res.status(401).json({ erro: 'Token inválido, corrompido ou expirado.' });
    }
};

// Middleware tático para proteger rotas exclusivas do Dashboard do Wiliam (Admin)
const somenteSupervisor = (req, res, next) => {
    if (req.usuario.role !== 'SUPERVISOR') {
        return res.status(403).json({ erro: 'Operação restrita ao nível de Supervisão.' });
    }
    next();
};

module.exports = { verificarToken, somenteSupervisor };