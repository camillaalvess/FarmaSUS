const supabase = require('../config/supabase');

class ReporteRepository {
  async criarRelato(dadosRelato) {
    const { ubsNome, medicamentoNome, situacao, dataVisita } = dadosRelato;

    const { data, error } = await supabase
      .from('relatos_estoque')
      .insert([
        {
          ubs_nome: ubsNome,
          medicamento_nome: medicamentoNome,
          situacao: situacao,
          data_visita: dataVisita
        }
      ])
      .select();

    if (error) {
      throw new Error(`Erro ao salvar relato no banco: ${error.message}`);
    }

    return data[0];
  }
}

module.exports = new ReporteRepository();