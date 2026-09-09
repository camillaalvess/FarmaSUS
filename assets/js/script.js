/* ==========================================================================
   FarmaSUS — script.js
   Navegação SPA (Seção Única Exclusiva), Busca, Geolocalização e Interações
   ========================================================================== */

// --- 1. FUNÇÃO DE EXIBIÇÃO EXCLUSIVA DA SEÇÃO CLICADA ---

function mostrarConteudo(idSecao) {
    // 1. Remove a visualização inicial que oculta o <main>
    document.body.classList.remove('initial-view');

    // 2. Esconde TODAS as seções dentro do main
    const todasSecoes = document.querySelectorAll('main section');
    todasSecoes.forEach(sec => sec.classList.remove('active-section'));

    // 3. Exibe EXCLUSIVAMENTE a seção referente ao card clicado
    const secaoAlvo = document.getElementById(idSecao);
    if (secaoAlvo) {
        secaoAlvo.classList.add('active-section');
        
        // Rola a tela suavemente até a seção aberta
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

// --- 3. DADOS MOCKADOS DE UNIDADES (UBS) ---

const ubsMock = [
    {
        id: 1,
        nome: "UBS I - Centro de Saúde da Família",
        endereco: "Rua das Flores, 120 — Centro",
        bairro: "Centro",
        telefone: "(83) 3214-0001",
        horario: "Segunda a Sexta, das 07:00 às 16:00",
        coordenadas: { lat: -7.119, lon: -34.881 },
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
        coordenadas: { lat: -7.165, lon: -34.832 },
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
        coordenadas: { lat: -7.151, lon: -34.839 },
        estoque: {
            "Metformina 850mg": { nivel: 50, status: "medio", label: "Estoque Médio" },
            "Insulina NPH 100UI/ml": { nivel: 70, status: "alto", label: "Estoque Alto" }
        }
    }
];

// --- 4. LÓGICA DE BUSCA DE MEDICAMENTOS ---

const formBusca = document.getElementById('form-busca');
const inputMedicamento = document.getElementById('medicamento');
const inputRegiao = document.getElementById('regiao');
const containerResultados = document.getElementById('container-resultados');

if (formBusca) {
    formBusca.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o reload da página

        const termoMedicamento = inputMedicamento.value.trim().toLowerCase();
        const termoRegiao = inputRegiao.value.trim().toLowerCase();

        containerResultados.innerHTML = '<p class="text-muted text-center">Buscando...</p>';

        setTimeout(() => {
            const resultados = ubsMock.filter(ubs => {
                const correspondeBairro = termoRegiao === '' || ubs.bairro.toLowerCase().includes(termoRegiao);
                const possuiMedicamento = Object.keys(ubs.estoque).some(medNome => 
                    medNome.toLowerCase().includes(termoMedicamento)
                );
                return correspondeBairro && possuiMedicamento;
            });

            renderizarCards(resultados, inputMedicamento.value.trim());
            mostrarConteudo('status'); // Redireciona dinamicamente para os resultados
        }, 500);
    });
}

function renderizarCards(listaUbs, medicamentoProcurado) {
    containerResultados.innerHTML = '';

    if (listaUbs.length === 0) {
        containerResultados.innerHTML = '<p class="text-danger text-center">Nenhuma unidade encontrada para essa busca na região selecionada.</p>';
        return;
    }

    const termoMedLower = medicamentoProcurado.toLowerCase();

    listaUbs.forEach(ubs => {
        // Encontra a chave exata do medicamento no estoque via comparação case-insensitive
        const medChaveExata = Object.keys(ubs.estoque).find(med => med.toLowerCase().includes(termoMedLower));
        
        const medNomeReal = medChaveExata || medicamentoProcurado;
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
                        <p><strong>Telefone:</strong> <a href="tel:${ubs.telefone.replace(/\D/g, '')}">${ubs.telefone}</a></p>
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

// --- 5. FORMULÁRIO DE REPORTE ---

const formReportar = document.querySelector('#reportar form');

if (formReportar) {
    formReportar.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Obrigado! Seu relato sobre a disponibilidade foi enviado com sucesso.');
        formReportar.reset();
    });
}

function preencherReporte(ubsNome, medNome) {
    mostrarConteudo('reportar');
    document.getElementById('rep-ubs').value = ubsNome;
    document.getElementById('rep-med').value = medNome;
    document.getElementById('rep-status').focus();
}

// --- 6. GEOLOCALIZAÇÃO AO CARREGAR ---

function tentarAutocompletarRegiao() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

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

            if (ubsMaisProxima && menorDistancia < 0.5) {
                inputRegiao.value = ubsMaisProxima.bairro;
            }
        });
    }
}

window.addEventListener('load', tentarAutocompletarRegiao);