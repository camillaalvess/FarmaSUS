import { API_URL, SUPABASE_URL } from './config.js';
import { mostrarConteudo } from './ui.js';

export function alternarModoAuth(modo) {
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

export function loginSocial(provedor) {
    const redirectUrl = window.location.origin;
    window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=${provedor}&redirect_to=${encodeURIComponent(redirectUrl)}`;
}

export function realizarLogout() {
    localStorage.removeItem('usuarioFarmaSUS');
    localStorage.removeItem('tokenFarmaSUS');
    alert('Sessão encerrada com sucesso.');
    window.location.reload();
}

export async function recuperarSenha(event) {
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

export function inicializarFormulariosAuth() {
    const formLogin = document.getElementById('form-login');
    const formCadastrar = document.getElementById('form-cadastrar');
    const formNovaSenha = document.getElementById('form-nova-senha');

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
                alert('Sessão expirada. Por favor, solicite a redefinição de senha novamente.');
                window.location.href = window.location.origin;
                return;
            }

            try {
                const resposta = await fetch(`${API_URL}/auth/redefinir-senha`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, newPassword })
                });

                const resultado = await resposta.json();

                if (resposta.ok && resultado.sucesso) {
                    alert('Senha atualizada com sucesso! Faça login com a sua nova senha.');
                    localStorage.removeItem('tokenFarmaSUS');
                    window.location.href = window.location.origin;
                } else {
                    alert(`Erro ao atualizar senha: ${resultado.mensagem || 'Tente novamente.'}`);
                }
            } catch (erro) {
                console.error('Erro ao salvar nova senha:', erro);
                alert('Não foi possível conectar ao servidor.');
            }
        });
    }
}

// Expõe no window para onclick inlines do HTML
window.alternarModoAuth = alternarModoAuth;
window.loginSocial = loginSocial;
window.realizarLogout = realizarLogout;
window.recuperarSenha = recuperarSenha;