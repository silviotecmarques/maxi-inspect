const { Pool } = require('pg');
require('dotenv').config();

// Configuração usando as variáveis do seu arquivo .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Teste rápido de conexão
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Erro ao conectar ao PostgreSQL:', err.stack);
  }
  console.log('✅ Conexão com o Banco de Dados (Maxi Inspect) estabelecida!');
  release();
});

module.exports = pool;