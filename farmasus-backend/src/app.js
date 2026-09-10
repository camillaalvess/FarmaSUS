const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Libera o acesso para o seu Live Server e requisições do front-end
app.use(cors());

// Permite que a API receba dados em formato JSON no req.body
app.use(express.json());

// Carrega as rotas da aplicação (/api/medicamentos, /api/reportar, /api/auth/...)
app.use(routes);

module.exports = app;