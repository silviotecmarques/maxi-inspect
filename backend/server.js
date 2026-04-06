require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express(); // 🔥 TEM QUE VIR ANTES DE TUDO

// =========================================
// MIDDLEWARES
// =========================================
app.use(cors());
app.use(express.json());

// 🔥 AGORA PODE USAR
app.use('/uploads', express.static('uploads'));

// =========================================
// ROTAS
// =========================================
const authRoutes = require('./src/routes/authRoutes');
const tarefaRoutes = require('./src/routes/tarefaRoutes');
const execucaoRoutes = require('./src/routes/execucaoRoutes');
const conviteRoutes = require('./src/routes/conviteRoutes');
const tradesRoutes = require('./src/routes/tradesRoutes');
const lojasRoutes = require('./src/routes/lojasRoutes');
const pontosRoutes = require('./src/routes/pontosRoutes');
const masterRoutes = require('./src/routes/masterRoutes');

app.use('/auth', authRoutes);
app.use('/tarefas', tarefaRoutes);
app.use('/execucoes', execucaoRoutes);
app.use('/convites', conviteRoutes);
app.use('/trades', tradesRoutes);
app.use('/lojas', lojasRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/pontos', pontosRoutes);
app.use('/master', masterRoutes);

// =========================================
// START
// =========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});