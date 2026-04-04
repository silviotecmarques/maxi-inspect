const db = require('./src/config/db');

async function seed() {
  try {
    console.log('🌱 Iniciando seed...');

    // EMPRESA
    await db.query(`
      INSERT INTO empresas (id, nome, cnpj)
      VALUES (1, 'Apoio Pharma', '28955226000165')
      ON CONFLICT (id) DO NOTHING
    `);

    // MASTER
    await db.query(`
      INSERT INTO usuarios (nome, email, pin, role, empresa_id)
      VALUES ('Silvio Master', 'master@maxi.com', '123456', 'MASTER', 1)
      ON CONFLICT DO NOTHING
    `);

    console.log('👑 MASTER criado');
    console.log('📧 Email: master@maxi.com');
    console.log('🔑 PIN: 123456');

    console.log('✅ Seed concluído');

  } catch (err) {
    console.error(err);
  }
}

seed();