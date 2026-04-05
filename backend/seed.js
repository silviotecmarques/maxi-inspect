const db = require('./src/config/db');

async function seed() {
  try {
    console.log('🌱 Iniciando seed...');

    
    // MASTER COM SENHA
    await db.query(`
      INSERT INTO usuarios (nome, email, pin, senha, role, empresa_id)
      VALUES ('Silvio Master', 'master@maxi.com', '000000', '010203ES', 'MASTER', 1)
      ON CONFLICT DO NOTHING
    `);

    // EMPRESA
    await db.query(`
      INSERT INTO empresas (id, nome, cnpj)
      VALUES (1, 'Apoio Pharma', '28955226000165')
      ON CONFLICT (id) DO NOTHING
    `);

    console.log('👑 MASTER criado');
    console.log('📧 Email: master@maxi.com');
    console.log('🔑 PIN: 0000');
    console.log('🔒 SENHA: 010203ES');

    console.log('✅ Seed concluído');

  } catch (err) {
    console.error(err);
  }
}

seed();