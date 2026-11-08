import { mostrarConteudo } from './ui.js';
import { inicializarFormulariosAuth } from './auth.js';
import { inicializarBusca } from './busca.js';
import { inicializarFormularioReporte } from './reporte.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização dos escutadores de eventos dos formulários
    inicializarFormulariosAuth();
    inicializarBusca();
    inicializarFormularioReporte();

    // Verificação de tokens e parâmetros de URL (OAuth Google e Redefinição de Senha)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    // Se for link de redefinição de senha: mantém 'not-logged-in' para ocultar o menu azul
    if (type === 'recovery' && accessToken) {
        localStorage.setItem('tokenFarmaSUS', accessToken);
        window.location.hash = '';

        document.body.classList.add('not-logged-in');

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