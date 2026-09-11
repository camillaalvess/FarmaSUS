const express = require('express');
const cors = require('cors');

// Importação das rotas
const authRoutes = require('./routes/authRoutes');
const indexRoutes = require('./routes/index.js');
const reporteRoutes = require('./routes/reporteRoutes');
const ubsRoutes = require('./routes/ubsRoutes');

const app = express();

// Middlewares essenciais para parsing e CORS
app.use(cors());
app.use(express.json());

// Mapeamento das rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/reportar', reporteRoutes);
app.use('/api/ubs', ubsRoutes);

// Registra as rotas de busca de medicamentos e rotas gerais do index.js
app.use('/api', indexRoutes);

module.exports = app;