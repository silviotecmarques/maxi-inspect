const jwt = require('jsonwebtoken');

const SECRET = "maxi-secret"; // depois vamos proteger isso

// =========================================
// VERIFICAR TOKEN
// =========================================
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não enviado" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // 🔥 agora temos o usuário na requisição
    next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido" });
  }
}

// =========================================
// VERIFICAR ROLE
// =========================================
function verificarRole(rolesPermitidas) {
  return (req, res, next) => {
    const role = req.user.role;

    if (!rolesPermitidas.includes(role)) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    next();
  };
}

module.exports = { verificarToken, verificarRole };