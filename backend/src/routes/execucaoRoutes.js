const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verificarToken, verificarRole } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// =========================================
// CONFIG UPLOAD
// =========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const nome = Date.now() + path.extname(file.originalname);
    cb(null, nome);
  }
});

const upload = multer({ storage });

// =========================================
// ENVIAR FOTO (PROMOTOR)
// =========================================
router.post('/enviar',
  verificarRole(['PROMOTOR']),
  upload.single('imagem'),
  async (req, res) => {
    try {
      const { tarefa_id, loja_id, ponto_id } = req.body;

      const imagem_url = `/uploads/${req.file.filename}`;

      const result = await db.query(
        `INSERT INTO execucoes 
        (tarefa_id, loja_id, ponto_id, imagem_url, status)
        VALUES ($1, $2, $3, $4, 'PENDENTE')
        RETURNING *`,
        [tarefa_id, loja_id, ponto_id, imagem_url]
      );

      res.status(201).json(result.rows[0]);

    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao enviar execução' });
    }
});

module.exports = router;