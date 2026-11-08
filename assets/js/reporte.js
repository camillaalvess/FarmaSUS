import { API_URL } from './config.js';
import { mostrarConteudo } from './ui.js';

export function inicializarFormularioReporte() {
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
}

export function preencherReporte(ubsNome, medNome) {
    mostrarConteudo('reportar');
    const inputUbs = document.getElementById('rep-ubs');
    const inputMed = document.getElementById('rep-med');
    const inputStatus = document.getElementById('rep-status');

    if (inputUbs) inputUbs.value = ubsNome;
    if (inputMed) inputMed.value = medNome;
    if (inputStatus) inputStatus.focus();
}

// Expõe globalmente no window para manter suporte ao onclick dos cards
window.preencherReporte = preencherReporte;