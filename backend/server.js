const express = require('express');
const cors = require('cors');
const db = require('./src/config/db'); // Importa a conexão que acabamos de criar
const authRoutes = require('./src/routes/authRoutes'); 
const empresaRoutes = require('./src/routes/empresaRoutes');
const lojaRoutes = require('./src/routes/lojaRoutes');
const userRoutes = require('./src/routes/userRoutes')
const pvdRoutes = require('./src/routes/pvdRoutes');
const tarefaRoutes = require('./src/routes/tarefaRoutes');
const execucaoRoutes = require('./src/routes/execucaoRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/empresas', empresaRoutes);
app.use('/lojas', lojaRoutes);
app.use('/usuarios', userRoutes);
app.use('/pvd', pvdRoutes);
app.use('/tarefas', tarefaRoutes);
app.use('/execucoes', execucaoRoutes);

// Rota de teste
app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ 
      mensagem: "Maxi Inspect Backend Rodando!", 
      banco_hora: result.rows[0].now 
    });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao acessar o banco" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor tático rodando na porta ${PORT}`);
});