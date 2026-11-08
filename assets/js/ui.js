let historicoNavegacao = [];
let secaoAtual = null;

export function mostrarConteudo(idSecao, registrarHistorico = true) {
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

export function voltarParaAnterior() {
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

export function togglePassword(inputId, btnElement) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        btnElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
    } else {
        input.type = 'password';
        btnElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    }
}

// Expõe globalmente no window para manter compatibilidade com onclick inline do HTML
window.mostrarConteudo = mostrarConteudo;
window.voltarParaAnterior = voltarParaAnterior;
window.togglePassword = togglePassword;