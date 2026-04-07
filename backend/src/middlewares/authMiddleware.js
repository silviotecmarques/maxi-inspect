const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || "maxi-secret";

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não enviado" });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ erro: "Token mal formatado" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ erro: "Token mal formatado" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    if (!decoded.id || !decoded.role || !decoded.empresa_id) {
      return res.status(401).json({ erro: "Token inválido" });
    }

    req.user = decoded;

    next();
  } catch (err) {
    console.error("Erro no token:", err.message);
    return res.status(401).json({ erro: "Token inválido" });
  }
}

function verificarRole(rolesPermitidas) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    if (!rolesPermitidas.includes(req.user.role)) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    next();
  };
}

module.exports = { verificarToken, verificarRole };