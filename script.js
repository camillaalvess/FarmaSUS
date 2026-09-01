/* ==========================================================================
   FarmaSUS — script.js
   Lógica de Simulação, Busca e Renderização Dinâmica (DOM)
   ========================================================================== */

// --- 1. SIMULAÇÃO DE DADOS (NOSSO "BANCO DE DADOS" LOCAL) ---

const medicamentosMock = [
    "Insulina NPH 100UI/ml",
    "Losartana Potássica 50mg",
    "Dipirona Sódica 500mg",
    "Metformina 850mg",
    "Paracetamol 500mg"
];

const ubsMock = [
    {
        id: 1,
        nome: "UBS I - Centro de Saúde da Família",
        endereco: "Rua das Flores, 120 — Centro",
        bairro: "Centro",
        telefone: "(83) 3214-0001",
        horario: "Segunda a Sexta, das 07:00 às 16:00",
        coordenadas: { lat: -7.119, lon: -34.881 }, // Próximo ao centro de JP
        estoque: {
            "Insulina NPH 100UI/ml": { nivel: 80, status: "alto", label: "Estoque Alto" },
            "Losartana Potássica 50mg": { nivel: 10, status: "baixo", label: "Estoque Crítico" }
        }
    },
    {
        id: 2,
        nome: "UBS II - Mangabeira Saúde",
        endereco: "Av. Josefa Taveira, 450 — Mangabeira",
        bairro: "Mangabeira",
        telefone: "(83) 3214-0002",
        horario: "Segunda a Sexta, das 07:00 às 17:00",
        coordenadas: { lat: -7.165, lon: -34.832 }, // Mangabeira
        estoque: {
            "Losartana Potássica 50mg": { nivel: 15, status: "baixo", label: "Estoque Crítico" },
            "Dipirona Sódica 500mg": { nivel: 90, status: "alto", label: "Estoque Alto" }
        }
    },
    {
        id: 3,
        nome: "UBS III - Bancários",
        endereco: "Rua Sérgio Meira, s/n — Bancários",
        bairro: "Bancários",
        telefone: "(83) 3214-0003",
        horario: "Segunda a Sexta, das 07:00 às 16:00",
        coordenadas: { lat: -7.151, lon: -34.839 }, // Bancários
        estoque: {
            "Metformina 850mg": { nivel: 50, status: "medio", label: "Estoque Médio" },
            "Insulina NPH 100UI/ml": { nivel: 70, status: "alto", label: "Estoque Alto" }
        }
    }
];

// --- 2. MAPEAMENTO DE ELEMENTOS DO DOM ---
const formBusca = document.getElementById('form-busca');
const inputMedicamento = document.getElementById('medicamento');
const inputRegiao = document.getElementById('regiao');
const containerResultados = document.getElementById('container-resultados');

// --- 3. LÓGICA PRINCIPAL DE BUSCA ---

formBusca.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const termoMedicamento = inputMedicamento.value.trim().toLowerCase();
    const termoRegiao = inputRegiao.value.trim().toLowerCase();

    // Limpa os resultados anteriores
    containerResultados.innerHTML = '<p class="text-muted text-center">Buscando...</p>';

    // Simula um pequeno atraso de rede (UX)
    setTimeout(() => {
        // Filtra as UBS
        const resultados = ubsMock.filter(ubs => {
            const correspondeBairro = ubs.bairro.toLowerCase().includes(termoRegiao);
            
            // Verifica se o medicamento procurado existe no estoque desta UBS
            // Usamos Object.keys().some() para verificar se alguma chave (nome do remédio) bate
            const possuiMedicamento = Object.keys(ubs.estoque).some(medNome => 
                medNome.toLowerCase().includes(termoMedicamento)
            );

            return correspondeBairro && possuiMedicamento;
        });

        renderizarCards(resultados, inputMedicamento.value.trim());
    }, 800);
});

// --- 4. FUNÇÃO DE RENDERIZAÇÃO DOS CARDS (DOM MANIPULATION) ---

function renderizarCards(listaUbs, medicamentoProcurado) {
    containerResultados.innerHTML = ''; // Limpa o "Buscando..."

    if (listaUbs.length === 0) {
        containerResultados.innerHTML = '<p class="text-danger text-center">Nenhuma unidade encontrada para essa busca na região selecionada.</p>';
        return;
    }

    // Cria o HTML para cada UBS encontrada
    listaUbs.forEach(ubs => {
        // Busca os dados específicos do estoque do medicamento procurado
        // (Pegamos o primeiro que bate, simplificadamente)
        const medNomeReal = Object.keys(ubs.estoque).find(med => med.includes(medicamentoProcurado));
        const dadosEstoque = ubs.estoque[medNomeReal];

        // Mapeamento de classes CSS baseadas no status
        const classMap = {
            alto: { card: 'card-high', badge: 'status-high', text: 'text-success', label: 'Situação Normal' },
            medio: { card: 'card-medium', badge: 'status-medium', text: 'text-warning', label: 'Estoque Médio' }, // Adicione text-warning no CSS se quiser
            baixo: { card: 'card-low', badge: 'status-low', text: 'text-danger', label: 'Risco de Desabastecimento' }
        };
        const estilos = classMap[dadosEstoque.status];

        const cardHtml = `
            <article class="ubs-card ${estilos.card}">
                <div class="ubs-header">
                    <h3>${ubs.nome}</h3>
                    <mark class="status-badge ${estilos.badge}">${medNomeReal}: ${dadosEstoque.label}</mark>
                </div>
                
                <div class="ubs-body">
                    <div class="ubs-info">
                        <p><strong>Endereço:</strong> ${ubs.endereco}</p>
                        <!-- UX: Link de telefone funcional -->
                        <p><strong>Telefone:</strong> <a href="tel:${ubs.telefone.replace(/\D/g, '')}">${ubs.telefone}</a></p>
                        <p><strong>Horário:</strong> ${ubs.horario}</p>
                    </div>

                    <div class="stock-box">
                        <p><strong>Nível de Estoque Estimado:</strong></p>
                        <label for="meter-ubs${ubs.id}">Capacidade em Estoque (${dadosEstoque.nivel}%):</label>
                        <!-- Usamos o elemento nativo <meter> -->
                        <meter id="meter-ubs${ubs.id}" min="0" max="100" low="25" high="75" optimum="100" value="${dadosEstoque.nivel}">${dadosEstoque.nivel}%</meter>
                        <small class="stock-label ${estilos.text}">${estilos.label}</small>
                    </div>

                    <!-- Novo: Botão de Reportar contextualizado -->
                    <button type="button" class="btn-report-card" onclick="preencherReporte('${ubs.nome}', '${medNomeReal}')">
                        Vi algo diferente? Clique para reportar.
                    </button>
                </div>

                <div class="footer-meta">
                    <p>Última confirmação: <time datetime="${new Date().toISOString()}">Hoje</time> | Relatado comunitariamente</p>
                </div>
            </article>
        `;

        // Insere o card no contêiner
        containerResultados.insertAdjacentHTML('beforeend', cardHtml);
    });
}

// --- 5. LÓGICA DE GEOLOCALIZAÇÃO (PRE-SELECIONAR BAIRRO) ---

// Função que tenta obter a localização do usuário ao carregar a página
function tentarAutocompletarRegiao() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            // Encontra a UBS mais próxima (usando uma fórmula de distância simplificada)
            let ubsMaisProxima = null;
            let menorDistancia = Infinity;

            ubsMock.forEach(ubs => {
                const dist = Math.sqrt(
                    Math.pow(ubs.coordenadas.lat - userLat, 2) + 
                    Math.pow(ubs.coordenadas.lon - userLon, 2)
                );
                if (dist < menorDistancia) {
                    menorDistancia = dist;
                    ubsMaisProxima = ubs;
                }
            });

            // Se encontrou uma UBS próxima (dentro de JP, por exemplo)
            if (ubsMaisProxima && menorDistancia < 0.5) { // 0.5 é um raio arbitrário
                inputRegiao.value = ubsMaisProxima.bairro;
                inputRegiao.classList.add('geo-located'); // Você pode estilizar isso no CSS
                // Opcional: Mostrar uma mensagem sutil pro usuário
                // console.log(`Bairro pré-selecionado baseado na sua localização: ${ubsMaisProxima.bairro}`);
            }

        }, function(error) {
            console.warn("Geolocalização não autorizada ou indisponível.");
        });
    }
}

// Executa a tentativa de geolocalização ao carregar a página
window.addEventListener('load', tentarAutocompletarRegiao);


// --- 6. FUNÇÃO AUXILIAR PARA O BOTÃO REPORTAR ---

function preencherReporte(ubsNome, medNome) {
    // Rola a página até a seção de reporte
    document.getElementById('reportar').scrollIntoView({ behavior: 'smooth' });
    
    // Preenche os campos do formulário de reporte
    document.getElementById('rep-ubs').value = ubsNome;
    document.getElementById('rep-med').value = medNome;
    
    // Foca no próximo campo pro usuário continuar
    document.getElementById('rep-status').focus();
}