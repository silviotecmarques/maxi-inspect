const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// =========================================
// STORAGE
// =========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);

    cb(null, `${hash}${ext}`);
  }
});

// =========================================
// FILTRO DE ARQUIVO
// =========================================
function fileFilter(req, file, cb) {
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg'];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo inválido'));
  }
}

// =========================================
// CONFIG FINAL
// =========================================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = upload;