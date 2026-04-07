const db = require('../config/db');

// LISTAR
exports.listar = async (req, res) => {
  try {
    const empresa_id = req.user.empresa_id;

    const result = await db.query(
      `SELECT * FROM trades 
       WHERE empresa_id = $1
       ORDER BY id DESC`,
      [empresa_id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar trades' });
  }
};

// CRIAR
exports.criar = async (req, res) => {
  try {
    const empresa_id = req.user.empresa_id;

    const { titulo, loja_id, status, data_limite } = req.body;
    const imagem = req.file ? req.file.filename : null;

    const result = await db.query(
      `INSERT INTO trades 
       (titulo, loja_id, status, data_limite, imagem, empresa_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [titulo, loja_id, status, data_limite, imagem, empresa_id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar trade' });
  }
};

// APROVAR SUPERVISOR
exports.aprovarSupervisor = async (req, res) => {
  try {
    const empresa_id = req.user.empresa_id;
    const { id } = req.params;

    await db.query(
      `UPDATE trades 
       SET aprovado_supervisor = true, status = 'aguardando_industria'
       WHERE id = $1 AND empresa_id = $2`,
      [id, empresa_id]
    );

    res.json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao aprovar' });
  }
};

// REPROVAR
exports.reprovar = async (req, res) => {
  try {
    const empresa_id = req.user.empresa_id;
    const { id } = req.params;

    await db.query(
      `UPDATE trades 
       SET status = 'reprovado'
       WHERE id = $1 AND empresa_id = $2`,
      [id, empresa_id]
    );

    res.json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao reprovar' });
  }
};

// APROVAR INDUSTRIA
exports.aprovarIndustria = async (req, res) => {
  try {
    const empresa_id = req.user.empresa_id;
    const { id } = req.params;

    await db.query(
      `UPDATE trades 
       SET aprovado_industria = true, status = 'finalizado'
       WHERE id = $1 AND empresa_id = $2`,
      [id, empresa_id]
    );

    res.json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao aprovar industria' });
  }
};