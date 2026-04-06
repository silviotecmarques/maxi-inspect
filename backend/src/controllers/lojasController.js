const db = require('../config/db');

exports.listar = async (req, res) => {
  const result = await db.query('SELECT * FROM lojas');
  res.json(result.rows);
};