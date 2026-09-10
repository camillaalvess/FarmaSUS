const supabase = require('../config/supabase');

class UbsRepository {
  async buscarTodasUbsComEstoque() {
    // 1. Busca todas as UBSs
    const { data: ubsLista, error: ubsError } = await supabase
      .from('ubs')
      .select('*');

    if (ubsError) {
      throw new Error(`Erro ao buscar UBSs: ${ubsError.message}`);
    }

    // 2. Busca todos os medicamentos em estoque
    const { data: estoqueLista, error: estoqueError } = await supabase
      .from('estoque_medicamentos')
      .select('*');

    if (estoqueError) {
      throw new Error(`Erro ao buscar estoques: ${estoqueError.message}`);
    }

    // 3. Junta os medicamentos às suas respectivas UBSs
    const ubsComEstoque = ubsLista.map(ubs => {
      const medicamentosDaUbs = estoqueLista.filter(item => item.ubs_id === ubs.id);
      return {
        ...ubs,
        estoque_medicamentos: medicamentosDaUbs
      };
    });

    return ubsComEstoque;
  }
}

module.exports = new UbsRepository();