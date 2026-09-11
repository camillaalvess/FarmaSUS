/* ==========================================================================
   FarmaSUS — script.js
   ========================================================================== */

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : '/api';
const SUPABASE_URL = 'https://vyenaqkugitpjfmughqw.supabase.co';

// Pilha de histórico de navegação interna
let historicoNavegacao = [];
let secaoAtual = null;

// --- 1. FUNÇÃO DE EXIBIÇÃO E NAVEGAÇÃO ENTRE SEÇÕES ---

function mostrarConteudo(idSecao, registrarHistorico = true) {
    const usuarioLogado = localStorage.getItem('usuarioFarmaSUS');

    if (!usuarioLogado) {
        document.body.classList.add('not-logged-in');
        idSecao = 'login';
    } else {
        document.body.classList.remove('not-logged-in');
    }

    if (registrarHistorico && secaoAtual && secaoAtual !== idSecao && secaoAtual !== 'login') {
        historicoNavegacao.push(secaoAtual);
    }

    secaoAtual = idSecao;

    const todasSecoes = document.querySelectorAll('main section');
    todasSecoes.forEach(sec => sec.classList.remove('active-section'));

    const secaoAlvo = document.getElementById(idSecao);
    if (secaoAlvo) {
        secaoAlvo.classList.add('active-section');
        
        if (idSecao !== 'login') {
            const elementoTopo = secaoAlvo.getBoundingClientRect().top + window.pageYOffset - 10;
            window.scrollTo({ top: elementoTopo, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// --- 2. VOLTAR PARA A ABA ANTERIOR ---

function voltarParaAnterior() {
    if (historicoNavegacao.length > 0) {
        const secaoAnterior = historicoNavegacao.pop();
        mostrarConteudo(secaoAnterior, false);
    } else {
        const todasSecoes = document.querySelectorAll('main section');
        todasSecoes.forEach(sec => sec.classList.remove('active-section'));
        secaoAtual = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// --- 3. MOSTRAR / OCULTAR SENHA ---

function togglePassword(inputId, btnElement) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        btnElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
    } else {
        input.type = 'password';
        btnElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    }
}

// --- 4. ALTERNÂNCIA DE MODO (LOGIN x CADASTRO) ---

function alternarModoAuth(modo) {
    const formLogin = document.getElementById('form-login');
    const formCadastro = document.getElementById('form-cadastrar');
    const overlayLeft = document.getElementById('overlay-left');
    const overlayRight = document.getElementById('overlay-right');

    if (modo === 'cadastro') {
        if (formLogin) formLogin.style.display = 'none';
        if (formCadastro) formCadastro.style.display = 'flex';
        if (overlayLeft) overlayLeft.style.display = 'none';
        if (overlayRight) overlayRight.style.display = 'block';
    } else {
        if (formLogin) formLogin.style.display = 'flex';
        if (formCadastro) formCadastro.style.display = 'none';
        if (overlayLeft) overlayLeft.style.display = 'block';
        if (overlayRight) overlayRight.style.display = 'none';
    }
}

// --- 5. AUTENTICAÇÃO SOCIAL OFICIAL GOOGLE OAUTH ---

function loginSocial(provedor) {
    const redirectUrl = window.location.origin;
    window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=${provedor}&redirect_to=${encodeURIComponent(redirectUrl)}`;
}

// --- 6. LOGOUT ---

function realizarLogout() {
    localStorage.removeItem('usuarioFarmaSUS');
    localStorage.removeItem('tokenFarmaSUS');
    historicoNavegacao = [];
    alert('Sessão encerrada com sucesso.');
    window.location.reload();
}

// --- 7. SOLICITAÇÃO DE RECUPERAÇÃO DE SENHA VIA BACKEND ---

async function recuperarSenha(event) {
    event.preventDefault();

    const emailInput = document.getElementById('login-email');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email) {
        alert('Por favor, digite seu e-mail no campo "E-mail" para receber o link de redefinição de senha.');
        if (emailInput) emailInput.focus();
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/auth/recuperar-senha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const resultado = await resposta.json();

        if (resposta.ok && resultado.sucesso) {
            alert(`Instruções de redefinição enviadas para: ${email}. Verifique sua caixa de entrada e spam!`);
        } else {
            alert(`Atenção: ${resultado.mensagem || 'Não foi possível solicitar a redefinição.'}`);
        }
    } catch (erro) {
        console.error('Erro na recuperação de senha:', erro);
        alert('Erro ao conectar com o serviço de recuperação de senha.');
    }
}

// --- 8. ATUALIZAÇÃO DA NOVA SENHA APÓS CLICAR NO LINK DO E-MAIL ---

const formNovaSenha = document.getElementById('form-nova-senha');

if (formNovaSenha) {
    formNovaSenha.addEventListener('submit', async function(event) {
        event.preventDefault();

        const novaSenhaInput = document.getElementById('nova-senha-input');
        const newPassword = novaSenhaInput ? novaSenhaInput.value : '';
        const token = localStorage.getItem('tokenFarmaSUS');

        if (!newPassword || newPassword.length < 6) {
            alert('A nova senha precisa ter no mínimo 6 caracteres.');
            return;
        }

        if (!token) {
            alert('Sessão de redefinição inválida ou expirada. Solicite um novo e-mail de recuperação.');
            window.location.href = window.location.origin;
            return;
        }

        try {
            const resposta = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZW5hcWt1Z2l0cGpmbXVnaHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczOTY4MzcsImV4cCI6MjA1Mjk3MjgzN30.8V4X...' // Sua chave anon do Supabase
                },
                body: JSON.stringify({ password: newPassword })
            });

            if (resposta.ok) {
                alert('Senha atualizada com sucesso! Faça login com a sua nova senha.');
                localStorage.removeItem('tokenFarmaSUS');
                window.location.href = window.location.origin;
            } else {
                const erroData = await resposta.json();
                alert(`Erro ao atualizar senha: ${erroData.msg || erroData.message || 'Sessão expirada. Tente novamente.'}`);
            }
        } catch (erro) {
            console.error('Erro ao salvar nova senha:', erro);
            alert('Não foi possível conectar ao servidor de autenticação.');
        }
    });
}

// --- 9. BUSCA DE MEDICAMENTOS ---

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
                renderizarCards(resultado.dados, termoMedicamento);
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

function renderizarCards(listaUbs, medicamentoProcurado) {
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

// --- 10. FORMULÁRIO DE REPORTE ---

const formReportar = document.querySelector('#reportar form');

if (formReportar) {
    formReportar.addEventListener('submit', async function(event) {
        event.preventDefault();

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
                headers: { 'Content-Type': 'application/json' },
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
            alert('Não foi possível enviar o relato.');
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

// --- 11. AUTENTICAÇÃO VIA E-MAIL (LOGIN E CADASTRO) ---

const formLogin = document.getElementById('form-login');
const formCadastrar = document.getElementById('form-cadastrar');

if (formLogin) {
    formLogin.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const emailInput = document.getElementById('login-email');
        const senhaInput = document.getElementById('login-senha');

        const email = emailInput ? emailInput.value.trim() : '';
        const password = senhaInput ? senhaInput.value : '';

        try {
            const resposta = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                localStorage.setItem('usuarioFarmaSUS', JSON.stringify(resultado.usuario));
                localStorage.setItem('tokenFarmaSUS', resultado.token);
                
                document.body.classList.remove('not-logged-in');
                mostrarConteudo('consultar', false);
            } else {
                alert(`Erro ao entrar: ${resultado.mensagem}`);
            }
        } catch (erro) {
            console.error('Erro no login:', erro);
            alert('Não foi possível conectar ao servidor de autenticação.');
        }
    });
}

if (formCadastrar) {
    formCadastrar.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nomeInput = document.getElementById('cad-nome');
        const emailInput = document.getElementById('cad-email');
        const senhaInput = document.getElementById('cad-senha');

        const nome = nomeInput ? nomeInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const password = senhaInput ? senhaInput.value : '';

        try {
            const resposta = await fetch(`${API_URL}/auth/cadastrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, password })
            });

            const resultado = await resposta.json();

            if (resultado.sucesso) {
                alert('Cadastro realizado com sucesso! Faça login para continuar.');
                formCadastrar.reset();
                alternarModoAuth('login');
            } else {
                alert(`Atenção no cadastro: ${resultado.mensagem}`);
            }
        } catch (erro) {
            console.error('Erro no cadastro:', erro);
            alert('Não foi possível conectar ao servidor.');
        }
    });
}

// --- 12. VERIFICAÇÃO INICIAL, HASH DE RECOVERY E LOGINS ---

document.addEventListener('DOMContentLoaded', () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    // Se o tipo do link for recuperação de senha
    if (type === 'recovery' && accessToken) {
        localStorage.setItem('tokenFarmaSUS', accessToken);
        window.location.hash = '';

        document.body.classList.remove('not-logged-in');
        const todasSecoes = document.querySelectorAll('main section');
        todasSecoes.forEach(sec => sec.classList.remove('active-section'));

        const secaoNovaSenha = document.getElementById('nova-senha-section');
        if (secaoNovaSenha) {
            secaoNovaSenha.style.display = 'block';
            secaoNovaSenha.classList.add('active-section');
        }
        return;
    }

    // Fluxo padrão para login social Google OAuth
    if (accessToken) {
        localStorage.setItem('tokenFarmaSUS', accessToken);
        localStorage.setItem('usuarioFarmaSUS', JSON.stringify({ id: 'social_user', email: 'cidadao@farmasus.gov.br' }));
        window.location.hash = '';
    }

    const usuarioLogado = localStorage.getItem('usuarioFarmaSUS');

    if (!usuarioLogado) {
        mostrarConteudo('login', false);
    } else {
        document.body.classList.remove('not-logged-in');
        mostrarConteudo('consultar', false);
    }
});