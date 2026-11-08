/* ==========================================================================
   FarmaSUS — busca.js (Filtro de Medicamentos & Renderização de Cards)
   ========================================================================== */

import { API_URL } from './config.js';
import { mostrarConteudo } from './ui.js';

export function inicializarBusca() {
    const formBusca = document.getElementById('form-busca');
    const inputMedicamento = document.getElementById('medicamento');
    const inputRegiao = document.getElementById('regiao');
    const containerResultados = document.getElementById('container-resultados');

    if (formBusca) {
        formBusca.addEventListener('submit', async function(event) {
            event.preventDefault();

            const termoMedicamento = inputMedicamento ? inputMedicamento.value.trim() : '';
            const termoRegiao = inputRegiao ? inputRegiao.value.trim() : '';

            if (containerResultados) {
                containerResultados.innerHTML = '<p class="text-muted text-center">Buscando dados no servidor...</p>';
            }

            try {
                const queryParams = new URLSearchParams({
                    medicamento: termoMedicamento,
                    regiao: termoRegiao
                });

                const resposta = await fetch(`${API_URL}/medicamentos?${queryParams}`);
                const resultado = await resposta.json();

                if (resultado.sucesso) {
                    renderizarCards(resultado.dados, termoMedicamento, containerResultados);
                    mostrarConteudo('status');
                } else {
                    if (containerResultados) {
                        containerResultados.innerHTML = `<p class="text-danger text-center">Erro ao buscar dados: ${resultado.mensagem}</p>`;
                    }
                }
            } catch (erro) {
                console.error('Erro de conexão com a API:', erro);
                if (containerResultados) {
                    containerResultados.innerHTML = '<p class="text-danger text-center">Não foi possível conectar ao servidor.</p>';
                }
            }
        });
    }
}

function renderizarCards(listaUbs, medicamentoProcurado, containerResultados) {
    if (!containerResultados) return;
    containerResultados.innerHTML = '';

    if (!listaUbs || listaUbs.length === 0) {
        containerResultados.innerHTML = '<p class="text-danger text-center">Nenhuma unidade encontrada para essa busca na região selecionada.</p>';
        return;
    }

    const termoMedLower = (medicamentoProcurado || '').toLowerCase();

    listaUbs.forEach(ubs => {
        const medChaveExata = Object.keys(ubs.estoque || {}).find(med => med.toLowerCase().includes(termoMedLower));
        const medNomeReal = medChaveExata || medicamentoProcurado || 'Medicamento em Estoque';
        const dadosEstoque = medChaveExata ? ubs.estoque[medChaveExata] : { nivel: 50, status: "medio", label: "Estoque Informado" };

        const classMap = {
            alto: { card: 'card-high', badge: 'status-high', text: 'text-success' },
            medio: { card: 'card-medium', badge: 'status-medium', text: 'text-warning' },
            baixo: { card: 'card-low', badge: 'status-low', text: 'text-danger' }
        };
        const estilos = classMap[dadosEstoque.status] || classMap.medio;

        const cardHtml = `
            <article class="ubs-card ${estilos.card}">
                <div class="ubs-header">
                    <h3>${ubs.nome}</h3>
                    <mark class="status-badge ${estilos.badge}">${medNomeReal}: ${dadosEstoque.label}</mark>
                </div>
                <div class="ubs-body">
                    <div class="ubs-info">
                        <p><strong>Endereço:</strong> ${ubs.endereco}</p>
                        <p><strong>Telefone:</strong> <a href="tel:${ubs.telefone ? ubs.telefone.replace(/\D/g, '') : ''}">${ubs.telefone || 'Não informado'}</a></p>
                        <p><strong>Horário:</strong> ${ubs.horario}</p>
                    </div>
                    <div class="stock-box">
                        <p><strong>Nível de Estoque Estimado:</strong></p>
                        <label for="meter-ubs${ubs.id}">Capacidade em Estoque (${dadosEstoque.nivel}%):</label>
                        <meter id="meter-ubs${ubs.id}" min="0" max="100" low="25" high="75" optimum="100" value="${dadosEstoque.nivel}">${dadosEstoque.nivel}%</meter>
                    </div>
                    <button type="button" class="btn-report-card" onclick="preencherReporte('${ubs.nome.replace(/'/g, "\\'")}', '${medNomeReal.replace(/'/g, "\\'")}')">
                        Vi algo diferente? Clique para reportar.
                    </button>
                </div>
            </article>
        `;

        containerResultados.insertAdjacentHTML('beforeend', cardHtml);
    });
}