const ubsService = require('../services/ubsService');

class UbsController {
  async buscarUbs(req, res, next) {
    try {
      const { medicamento, regiao } = req.query;
      const resultados = await ubsService.consultarEstoque(medicamento, regiao);

      return res.status(200).json({
        sucesso: true,
        quantidade: resultados.length,
        dados: resultados
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UbsController();