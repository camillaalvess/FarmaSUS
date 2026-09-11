require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Só inicia o servidor com escuta ativa de porta se for ambiente local
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor executando em: http://localhost:${PORT}`);
  });
}

module.exports = app;