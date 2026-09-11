const express = require('express');
const cors = require('cors');

// Importação correta com base na estrutura de arquivos exibida
const authRoutes = require('./routes/authRoutes');
const indexRoutes = require('./routes/index.js');
const reporteRoutes = require('./routes/reporteRoutes');
const ubsRoutes = require('./routes/ubsRoutes');

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Registro das rotas na API
app.use('/api/auth', authRoutes);
app.use('/api/reportar', reporteRoutes);
app.use('/api/ubs', ubsRoutes);
app.use('/api', indexRoutes);

module.exports = app;