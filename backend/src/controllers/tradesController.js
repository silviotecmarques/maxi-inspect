const db = require('../config/db');

// LISTAR
exports.listar = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM trades ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar trades' });
  }
};

// CRIAR
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
    res.status(500).json({ erro: 'Erro ao criar trade' });
  }
};

// ✅ APROVAR SUPERVISOR
exports.aprovarSupervisor = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE trades 
       SET aprovado_supervisor = true, status = 'aguardando_industria'
       WHERE id = $1`,
      [id]
    );

    res.json({ ok: true });

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao aprovar' });
  }
};

// ❌ REPROVAR
exports.reprovar = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE trades 
       SET status = 'reprovado'
       WHERE id = $1`,
      [id]
    );

    res.json({ ok: true });

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao reprovar' });
  }
};

// ✅ APROVAR INDUSTRIA
exports.aprovarIndustria = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE trades 
       SET aprovado_industria = true, status = 'finalizado'
       WHERE id = $1`,
      [id]
    );

    res.json({ ok: true });

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao aprovar industria' });
  }
};