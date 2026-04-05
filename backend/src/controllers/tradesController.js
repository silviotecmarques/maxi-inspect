const db = require('../config/db');

// LISTAR
exports.listar = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM trades ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar trades' });
  }
};

// CRIAR COM UPLOAD
exports.criar = async (req, res) => {
  try {
    const { titulo, loja_id, status, data_limite } = req.body;

    const imagem = req.file ? req.file.filename : null;

    const result = await db.query(
      `INSERT INTO trades (titulo, loja_id, status, data_limite, imagem)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [titulo, loja_id, status, data_limite, imagem]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("ERRO NO BACKEND:", err);
    res.status(500).json({ erro: 'Erro ao criar trade' });
  }
};