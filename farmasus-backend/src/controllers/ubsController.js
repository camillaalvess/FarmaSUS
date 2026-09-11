const ubsService = require('../services/ubsService');

class UbsController {
  async buscarUbs(req, res) {
    try {
      const { medicamento, regiao } = req.query;
      const resultados = await ubsService.consultarEstoque(medicamento, regiao);

      return res.status(200).json({
        sucesso: true,
        quantidade: resultados ? resultados.length : 0,
        dados: resultados || []
      });
    } catch (error) {
      console.error('Erro na controller ao buscar UBS:', error);
      return res.status(500).json({
        sucesso: false,
        mensagem: error.message || 'Erro interno ao consultar o banco de dados.'
      });
    }
  }
}

module.exports = new UbsController();