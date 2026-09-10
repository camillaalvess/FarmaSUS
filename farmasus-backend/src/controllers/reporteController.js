const reporteService = require('../services/reporteService');

class ReporteController {
  async criar(req, res, next) {
    try {
      const { ubsNome, medicamentoNome, situacao, dataVisita } = req.body;

      const relatoSalvo = await reporteService.registrarRelato({
        ubsNome,
        medicamentoNome,
        situacao,
        dataVisita
      });

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Relato registrado com sucesso no banco de dados!',
        dados: relatoSalvo
      });
    } catch (error) {
      return res.status(400).json({
        sucesso: false,
        mensagem: error.message
      });
    }
  }
}

module.exports = new ReporteController();