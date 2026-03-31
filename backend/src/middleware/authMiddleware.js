const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ erro: "Nenhum token fornecido" });
    }

    // O token geralmente vem como "Bearer <TOKEN>", vamos limpar:
    const cleanToken = token.split(' ')[1] || token;

    jwt.verify(cleanToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ erro: "Token inválido ou expirado" });
        }

        // Injetamos os dados do usuário na requisição para usar depois
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.empresaId = decoded.empresa_id;
        
        next(); // Pode seguir para a rota!
    });
};