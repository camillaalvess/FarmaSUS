const reporteRepository = require('../repositories/reporteRepository');

class ReporteService {
  async registrarRelato(dados) {
    const { ubsNome, medicamentoNome, situacao, dataVisita } = dados;

    // Validações de negócio
    if (!ubsNome || !medicamentoNome || !situacao || !dataVisita) {
      throw new Error('Todos os campos (UBS, medicamento, situação e data) são obrigatórios.');
    }

    const novoRelato = await reporteRepository.criarRelato({
      ubsNome,
      medicamentoNome,
      situacao,
      dataVisita
    });

    return novoRelato;
  }
}

module.exports = new ReporteService();