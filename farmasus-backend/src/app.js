const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares essenciais para produção
app.use(cors());
app.use(express.json());

// Importação das suas rotas existentes
// const rotas = require('./routes/...');
// app.use('/api', rotas);

module.exports = app;