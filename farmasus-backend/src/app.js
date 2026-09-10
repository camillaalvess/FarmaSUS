const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Registro de Rotas da API
app.use(routes);

// Rota padrão de verificação de saúde da API
app.get('/', (req, res) => {
  res.status(200).json({
    sucesso: true,
    mensagem: 'API FarmaSUS rodando com sucesso! 💊'
  });
});

module.exports = app;