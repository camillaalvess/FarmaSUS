require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Executa o app.listen apenas quando estiver rodando localmente
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor FarmaSUS executando em: http://localhost:${PORT}`);
  });
}

module.exports = app;