# 💊 FarmaSUS — Mapeamento Colaborativo de Medicamentos no SUS

> 📌 **Projeto Acadêmico em Desenvolvimento** | *Fase Atual: HTML5 Semântico e Acessibilidade*

---

## 🚧 Status do Projeto

⚠️ **Em construção (Fase 1 - Estruturação Nativas & Semântica HTML5)**  
O repositório encontra-se atualmente focado na construção da base estrutural de marcação, priorizando acessibilidade (WCAG), semântica estrita de tags e validações nativas de formulário. Folhas de estilo (CSS), interatividade (JavaScript) e integração com APIs serão incorporadas nas próximas fases de desenvolvimento.

---

## 🔴 O Problema

Um dos maiores desafios enfrentados pelos usuários do Sistema Único de Saúde (SUS) no Brasil é a falta de previsibilidade e transparência no estoque de medicamentos essenciais nas Unidades Básicas de Saúde (UBS). 

Muitas vezes, cidadãos — frequentemente idosos ou pessoas com mobilidade reduzida — deslocam-se até os postos de saúde apenas para descobrir que o medicamento prescrito está em falta. Essa assimetria de informação gera:
* Deslocamentos desnecessários e custos com transporte;
* Interrupção involuntária de tratamentos contínuos (hipertensão, diabetes, etc.);
* Sobrecarga no atendimento presencial das UBS apenas para simples consultas de estoque.

---

## 💡 A Solução

O **FarmaSUS** é uma proposta de plataforma comunitária e colaborativa para o mapeamento da disponibilidade de medicamentos nas UBS. A aplicação visa conectar os próprios usuários da rede pública para que informem, em tempo real, o status de disponibilidade dos remédios encontrados após suas visitas aos postos.

Com isso, o sistema permite:
* Consulta prévia de estoque por bairro/unidade;
* Localização de unidades alternativas próximas com disponibilidade do item;
* Transparência e engajamento comunitário na gestão da saúde pública.

---

## 👥 Público-Alvo

* **Cidadãos dependentes da rede pública de saúde (SUS):** Especialmente pacientes crônicos, idosos, cuidadores e famílias de baixa renda.
* **Comunidade Local:** Moradores que desejam colaborar ativamente alimentando o status do estoque após o atendimento presencial.
* **Profissionais e Gestores de Saúde:** Que podem acompanhar o feedback da população sobre o fornecimento de insumos.

---

## ♿ Semântica e Acessibilidade (Fase Atual)

A primeira etapa do projeto foca exclusivamente nas melhores práticas de **HTML5 Semântico e Acessibilidade Nível AA**:

* **Estruturação Semântica:** Utilização de tags como `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<address>` e `<footer>`.
* **Acessibilidade para Leitores de Tela:**
  * Uso de atributos `aria-label` e `aria-labelledby` para identificação de áreas essenciais.
  * Hierarquia lógica de cabeçalhos (`<h1>` a `<h4>`) sem salto de níveis.
  * Associação direta de `<label>` e `<input>` via IDs únicos.
* **Componentes Nativos do HTML5:**
  * `<meter>` para representação do nível de estoque.
  * `<details>` e `<summary>` para áreas expansíveis de unidades alternativas e perguntas frequentes.
  * `<datalist>` acoplado à busca para sugestões de autocompletar.
  * `<time datetime="...">` para marcação cronológica legível por máquinas.
* **Formulários Acessíveis e Validações Nativas:**
  * Agrupamento semântico de campos com `<fieldset>` e `<legend>`.
  * Validações nativas utilizando `required`, `pattern`, `minlength` e tipos de entrada específicos (`datetime-local`, `email`, `search`).

---

## 🚀 Tecnologias e Roadmap Futuro

### 🛠️ Em Uso (Fase 1)
* **HTML5** (Estruturação semântica, acessibilidade ARIA e validações de formulário)
* **Git & GitHub** (Controle de versão e Pull Requests)

### 🔮 Tecnologias Futuras (Próximas Fases)
* **CSS3 / Tailwind CSS:** Estilização responsiva, suporte a Modo Escuro (Dark Mode) e design focado no usuário (*Mobile-First*).
* **JavaScript (ES6+):** Interatividade do formulário, manipulação do DOM e dinâmica de filtros de busca.
* **API RESTful / Node.js:** Backend para persistência de dados do estoque reportado.
* **Geolocation API:** Integração com mapas para localização automática da UBS mais próxima.

---

## 👩‍💻 Autoria

Desenvolvido por **Camilla Vitória**  
Aluna do curso de **Análise e Desenvolvimento de Sistemas (ADS)** — **UNIPÊ (Centro Universitário de João Pessoa)**.  

*Projeto acadêmico elaborado para a disciplina de Desenvolvimento Front-End para Web.*

---

## Avaliação em pares

**(02/09/2026):** Projeto muito bacana e bem organizado! A semântica do HTML5 e a acessibilidade ficaram ótimas, o visual com CSS está limpo e a busca com geolocalização no JavaScript foi uma sacada excelente.

Só deixo como sugestão rápida dar uma olhada na busca do `script.js`, que quebra se o usuário digitar o remédio com letras minúsculas (falta um `.toLowerCase()` na checagem dos cards), atualizar o status aqui no README (já que o CSS e o JS já estão funcionando) e adicionar uma confirmação no envio do formulário de reporte para a página não recarregar. Parabéns pelo trabalho, mandou super bem!

---

## Avaliação em pares

**(20/10/2026)** O projeto esta ótimo! Além de apresentar uma grande relevância social, dada sua utilidade comunitária no acompanhamento da disponibilidade de medicamentos. A estrutura do HTML é sólida e demonstra boa semântica. A estilização em CSS é moderna e faz uso de variáveis CSS, Grid e Flexbox, com breakpoints voltados à responsividade.

Porém existem um ponto de atenção que visualizei, por isso eu o deixo como sugestão de melhoria. Os arquivos style.css e script.js concentram todo o código em um único arquivo cada, ultrapassando 400 linhas e acumulando múltiplas responsabilidades (no JavaScript, por exemplo: autenticação, busca, reporte e navegação). Essa prática não é aconselhável do ponto de vista da manutenção. Sugiro fragmentá-los por funcionalidade, como auth.js, busca.js, reporte.js e ui.js no JavaScript e arquivos por área no CSS, visando maior organização, legibilidade e padronização.