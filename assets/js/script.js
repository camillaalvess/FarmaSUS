/* ==========================================================================
   FarmaSUS — script.js
   Navegação SPA, Integração com API Node.js/Supabase, Busca e Geolocalização
   ========================================================================== */

// Endereço base da API Node.js/Express
const API_URL = 'http://localhost:3000/api';

// --- 1. FUNÇÃO DE EXIBIÇÃO EXCLUSIVA DA SEÇÃO CLICADA ---

function mostrarConteudo(idSecao) {
    document.body.classList.remove('initial-view');

    const todasSecoes = document.querySelectorAll('main section');
    todasSecoes.forEach(sec => sec.classList.remove('active-section'));

    const secaoAlvo = document.getElementById(idSecao);
    if (secaoAlvo) {
        secaoAlvo.classList.add('active-section');
        
        setTimeout(() => {
            secaoAlvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}

// --- 2. SIMULAÇÃO DE LOGIN ---

function simularLogin() {
    alert("Redirecionando para a autenticação do Cidadão SUS...");
    mostrarConteudo('consultar');
}

// --- 3. LÓGICA DE BUSCA INTEGRADAS À API REAL ---

const formBusca = document.getElementById('form-busca');
const inputMedicamento = document.getElementById('medicamento');
const inputRegiao = document.getElementById('regiao');
const containerResultados = document.getElementById('container-resultados');

if (formBusca) {
    formBusca.addEventListener('submit', async function(event) {
        event.preventDefault();

        const termoMedicamento = inputMedicamento.value.trim();
        const termoRegiao = inputRegiao.value.trim();

        containerResultados.innerHTML = '<p class="text-muted text-center">Buscando dados no servidor...</p>';

        try {
            // Chamada Fetch para a rota GET /api/medicamentos do Node.js
            const queryParams = new URLSearchParams({
                medicamento: termoMedicamento,
                regiao: termoRegiao
            });

            const resposta = await fetch(`${API_URL}/medicamentos?${queryParams}`);
            const resultado = await resposta.json();

            if (resultado.sucesso) {
                renderizarCards(resultado.dados, termoMedicamento);
                mostrarConteudo('status');
            } else {
                containerResultados.innerHTML = `<p class="text-danger text-center">Erro ao buscar dados: ${resultado.mensagem}</p>`;
            }
        } catch (erro) {
            console.error('Erro de conexão com a API:', erro);
            containerResultados.innerHTML = '<p class="text-danger text-center">Não foi possível conectar ao servidor. Verifique se o backend está executando.</p>';
        }
    });
}

function renderizarCards(listaUbs, medicamentoProcurado) {
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

// --- 4. FORMULÁRIO DE REPORTE INTEGRADO À API (POST /api/reportar) ---

const formReportar = document.querySelector('#reportar form');

if (formReportar) {
    formReportar.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Mapeamento dos campos dos inputs do formulário
        const campoUbs = document.getElementById('rep-ubs');
        const campoMed = document.getElementById('rep-med');
        const campoStatus = document.getElementById('rep-status');

        const dadosRelato = {
            ubsNome: campoUbs ? campoUbs.value : '',
            medicamentoNome: campoMed ? campoMed.value : '',
            situacao: campoStatus ? campoStatus.value : 'Outro',
            dataVisita: new Date().toISOString()
        };

        try {
            const resposta = await fetch(`${API_URL}/reportar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosRelato)
            });

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                alert('Obrigado! Seu relato foi registrado com sucesso no banco de dados!');
                formReportar.reset();
            } else {
                alert(`Atenção: ${resultado.mensagem}`);
            }
        } catch (erro) {
            console.error('Erro ao registrar relato:', erro);
            alert('Não foi possível enviar o relato. Verifique a conexão com o servidor.');
        }
    });
}

function preencherReporte(ubsNome, medNome) {
    mostrarConteudo('reportar');
    const inputUbs = document.getElementById('rep-ubs');
    const inputMed = document.getElementById('rep-med');
    const inputStatus = document.getElementById('rep-status');

    if (inputUbs) inputUbs.value = ubsNome;
    if (inputMed) inputMed.value = medNome;
    if (inputStatus) inputStatus.focus();
}

// --- 5. GEOLOCALIZAÇÃO INTEGRADAS COM DADOS DA API ---

async function tentarAutocompletarRegiao() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            try {
                // Busca as UBSs cadastradas diretamente do backend
                const resposta = await fetch(`${API_URL}/medicamentos`);
                const resultado = await resposta.json();

                if (resultado.sucesso && resultado.dados.length > 0) {
                    let ubsMaisProxima = null;
                    let menorDistancia = Infinity;

                    resultado.dados.forEach(ubs => {
                        if (ubs.coordenadas) {
                            const dist = Math.sqrt(
                                Math.pow(ubs.coordenadas.lat - userLat, 2) + 
                                Math.pow(ubs.coordenadas.lon - userLon, 2)
                            );
                            if (dist < menorDistancia) {
                                menorDistancia = dist;
                                ubsMaisProxima = ubs;
                            }
                        }
                    });

                    if (ubsMaisProxima && menorDistancia < 0.5 && inputRegiao) {
                        inputRegiao.value = ubsMaisProxima.bairro;
                    }
                }
            } catch (erro) {
                console.warn('Não foi possível obter dados das UBSs para geolocalização:', erro);
            }
        });
    }
}

window.addEventListener('load', tentarAutocompletarRegiao);