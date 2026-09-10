const ubsRepository = require('../repositories/ubsRepository');

class UbsService {
  async consultarEstoque(termoMedicamento = '', termoRegiao = '') {
    const todasUbs = await ubsRepository.buscarTodasUbsComEstoque();

    // Tratamento contra valores 'undefined' ou nulos
    const medLower = (termoMedicamento || '').toString().trim().toLowerCase();
    const regLower = (termoRegiao || '').toString().trim().toLowerCase();

    // Filtra e formata o resultado para combinar com o Front-End
    const resultados = todasUbs.filter(ubs => {
      const correspondeBairro = regLower === '' || ubs.bairro.toLowerCase().includes(regLower);
      
      const possuiMedicamento = ubs.estoque_medicamentos && ubs.estoque_medicamentos.some(item =>
        medLower === '' || item.nome_medicamento.toLowerCase().includes(medLower)
      );

      return correspondeBairro && possuiMedicamento;
    }).map(ubs => {
      const estoqueMap = {};
      
      if (ubs.estoque_medicamentos) {
        ubs.estoque_medicamentos.forEach(item => {
          estoqueMap[item.nome_medicamento] = {
            nivel: item.nivel_porcentagem,
            status: item.status_estoque,
            label: item.rotulo_status
          };
        });
      }

      return {
        id: ubs.id,
        nome: ubs.nome,
        endereco: ubs.endereco,
        bairro: ubs.bairro,
        telefone: ubs.telefone,
        horario: ubs.horario,
        coordenadas: { lat: parseFloat(ubs.latitude), lon: parseFloat(ubs.longitude) },
        estoque: estoqueMap
      };
    });

    return resultados;
  }
}

module.exports = new UbsService();