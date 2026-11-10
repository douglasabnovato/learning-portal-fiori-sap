# Learning Portal Fiori SAP

Aplicação web desenvolvida com **SAPUI5** e **SAP Fiori**, criada como projeto de portfólio e laboratório prático para desenvolvimento de aplicações corporativas com UI5.

O projeto simula um **portal de aprendizagem tecnológica**, permitindo visualizar trilhas de formação, acompanhar progresso, consultar informações e explorar conceitos de desenvolvimento utilizando os padrões e componentes nativos do ecossistema SAPUI5.

---

## Estado e próximos passos (ciclo de 10/11/2026)

Sem site publicado: o GitHub Pages não está ligado, e `douglasabnovato.github.io/learning-portal-fiori-sap/` dá 404 em 10/11/2026 ([#3](https://github.com/douglasabnovato/learning-portal-fiori-sap/issues/3)). Para ver o projeto, rode localmente.

Critérios do MVP (N2): 8 de 12 atendidos em 10/11/2026 ([docs/MVP.md](docs/MVP.md)). A `main` só recebe mudanças por PR com o job `verificar` do CI verde.

**O que foi feito**
- Medição de uso sem cookie (GoatCounter, código `douglasabnovato`): só no site publicado, com o evento `abrir-trilha` e teste no navegador. Falta a conta ([#16](https://github.com/douglasabnovato/learning-portal-fiori-sap/issues/16)).
- O `deploy.yml` passa a publicar a cada push na `main` quando a variável `PAGES_VIA_ACTIONS` for `true`; continua testando antes de publicar.
- Meta da hipótese decidida no ciclo de 10/11/2026 (revisável).
- Antes: `main` protegida (10/11), resumo da jornada, ordenação e CI nos PRs para a `developer` ([#21](https://github.com/douglasabnovato/learning-portal-fiori-sap/pull/21)), aviso de falha e teste de teclado ([#11](https://github.com/douglasabnovato/learning-portal-fiori-sap/pull/11)), progresso salvo no navegador ([#9](https://github.com/douglasabnovato/learning-portal-fiori-sap/pull/9)).

**O que queremos fazer**
- [#3](https://github.com/douglasabnovato/learning-portal-fiori-sap/issues/3) Ligar o Pages e publicar (responsável).
- [#16](https://github.com/douglasabnovato/learning-portal-fiori-sap/issues/16) Criar a conta do GoatCounter (responsável).
- [#15](https://github.com/douglasabnovato/learning-portal-fiori-sap/issues/15) Medir LCP e acessibilidade no site publicado, depois da #3.
- [#27](https://github.com/douglasabnovato/learning-portal-fiori-sap/issues/27) Validar com uma pessoa de fora.
- [#18](https://github.com/douglasabnovato/learning-portal-fiori-sap/issues/18) Favoritos nas trilhas.
- [#19](https://github.com/douglasabnovato/learning-portal-fiori-sap/issues/19) ESLint e teste OPA5 no CI.
- [#20](https://github.com/douglasabnovato/learning-portal-fiori-sap/issues/20) Lista de módulos no detalhe da trilha.

**Onde está a documentação**
- Estado e critérios: [docs/MVP.md](docs/MVP.md).
- Plano do ciclo: [docs/PLANO-DE-ACAO.md](docs/PLANO-DE-ACAO.md), seção "Ciclo de 03/11/2026".

## 🎯 Objetivo do Projeto

O objetivo do Learning Portal Fiori SAP é construir uma aplicação que represente, de forma prática, uma solução corporativa moderna utilizando:

- SAPUI5
- SAP Fiori
- Fiori Horizon
- Arquitetura MVC
- XML Views
- Data Binding
- JSONModel
- Componentização
- Internacionalização (i18n)
- Controles nativos SAPUI5
- UI responsiva
- UI/UX orientada a aplicações corporativas

Além de funcionar como aplicação, o projeto também serve como laboratório para estudar e aplicar boas práticas de desenvolvimento SAPUI5.

---

## 🖥️ Visão da Aplicação

O Learning Portal apresenta uma área principal de aprendizagem contendo:

- apresentação da jornada de aprendizado;
- mensagem contextual ao usuário;
- catálogo de trilhas;
- progresso de cada trilha;
- status de aprendizado;
- quantidade de módulos;
- carga horária;
- acesso aos detalhes da trilha.

A interface utiliza **Cards responsivos** para transformar a antiga listagem administrativa em uma experiência mais próxima de um portal de aprendizagem.

---

## ✨ Funcionalidades Atuais

### 📚 Catálogo de Trilhas

As trilhas são carregadas dinamicamente a partir de um arquivo JSON local:

```text
webapp/model/trilhas.json
```

O modelo é disponibilizado pela configuração da aplicação e utilizado através de **Data Binding**.

---

### 🧭 Resumo da jornada e ordenação

O topo do catálogo mostra cinco números: trilhas, em andamento, concluídas, progresso geral e horas estudadas. O progresso geral soma os módulos de todas as trilhas, para uma trilha curta não pesar igual a uma longa. O atalho **Continuar** abre a trilha em andamento mais adiantada.

O catálogo pode ser ordenado por título, maior progresso ou menor carga horária, e volta à ordem original. O cálculo fica em `webapp/model/resumo.js`, com testes em `webapp/test/unit/resumo.qunit.js`.

---

### 🃏 Cards de Aprendizagem

As trilhas são apresentadas utilizando:

- `sap.f.Card`
- `sap.f.cards.Header`
- `sap.f.GridContainer`

Cada Card apresenta informações relevantes da trilha:

- título;
- status;
- descrição;
- percentual de progresso;
- módulos concluídos;
- total de módulos;
- carga horária;
- ação para visualizar detalhes.

A utilização de `sap.f` permite estruturar uma experiência visual mais adequada para dashboards e portais corporativos.

---

### 📊 Indicador de Progresso

Cada trilha apresenta seu progresso através do controle:

```text
sap.m.ProgressIndicator
```

O percentual é calculado pelo `model/formatter.js` a partir dos módulos concluídos:

```xml
percentValue="{ parts: ['Concluidos', 'ModulosCount'], formatter: '.formatter.progresso' }"
```

O estado visual também é definido de acordo com o status da trilha.

Exemplo:

```text
Concluído    → Success
Em Andamento → Information
Não Iniciado → None
```

---

### 🎯 Status das Trilhas

O status da formação é apresentado visualmente no Card.

Exemplos:

```text
Concluído
Em Andamento
Não Iniciado
```

A aplicação utiliza estados semânticos do SAPUI5 para facilitar a identificação visual da situação de cada trilha.

---

### 🌎 Internacionalização

A aplicação utiliza Resource Bundles para centralizar os textos da interface.

Arquivos:

```text
webapp/i18n/i18n.properties
webapp/i18n/i18n_en.properties
```

A interface utiliza bindings como:

```xml
text="{i18n>appTitle}"
```

e:

```xml
text="{i18n>welcomeTitle}"
```

Isso permite evoluir a aplicação para múltiplos idiomas sem manter textos diretamente espalhados pelas XML Views.

---

### 🎨 Fiori Horizon

A aplicação utiliza o tema:

```text
sap_horizon
```

A interface prioriza controles nativos SAPUI5 e utiliza o sistema visual do Fiori para manter consistência com aplicações corporativas SAP.

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura baseada em **Model-View-Controller (MVC)**.

```text
                    Learning Portal
                           │
                           ▼
                    Component.js
                           │
                           ▼
                    manifest.json
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
           View                      Controller
             │                           │
             │                           │
             ▼                           ▼
        Master.view.xml / Detail   Master / Detail.controller
             │
             ▼
           Model
             │
             ▼
       trilhas.json
```

### Model

Responsável pelos dados da aplicação.

```text
webapp/model/trilhas.json
```

### View

Responsável pela apresentação da interface.

```text
webapp/view/App.view.xml
```

### Controller

Responsável pela lógica e interação da tela.

```text
webapp/controller/App.controller.js
```

### Component

Responsável pela inicialização da aplicação.

```text
webapp/Component.js
```

### Manifest

Centraliza configurações da aplicação, dependências, modelos, internacionalização e demais configurações do componente.

```text
webapp/manifest.json
```

---

## 📁 Estrutura do Projeto

```text
learning-portal-fiori-sap/
│
├── .vscode/
│
├── webapp/
│   │
│   ├── controller/
│   │   ├── App.controller.js
│   │   └── Detail.controller.js
│   │
│   ├── i18n/
│   │   ├── i18n.properties
│   │   └── i18n_en.properties
│   │
│   ├── model/
│   │   └── trilhas.json
│   │
│   ├── view/
│   │   ├── App.view.xml
│   │   └── Detail.view.xml
│   │
│   ├── Component.js
│   ├── index.html
│   └── manifest.json
│
├── .gitignore
├── package.json
├── package-lock.json
├── readme.md
└── ui5.yaml
```

---

## 🛠️ Tecnologias Utilizadas

### SAPUI5

Framework utilizado para construção da aplicação.

Principais bibliotecas utilizadas:

```text
sap.m
sap.ui.core
sap.f
```

### SAP Fiori

Conceitos de design e experiência de usuário utilizados como referência para a construção da interface.

### Fiori Horizon

Tema visual utilizado na aplicação.

### JavaScript

Utilizado para implementação da lógica dos Controllers e interações da aplicação.

### XML

Utilizado para construção declarativa das Views SAPUI5.

### JSON

Utilizado como fonte de dados local da aplicação.

### UI5 CLI

Utilizado para execução e desenvolvimento local da aplicação.

---

## 🚀 Como Executar o Projeto

Pré-requisito: Node.js 20 ou superior. O UI5 CLI vem como dependência do projeto (não precisa instalar global).

```bash
git clone https://github.com/douglasabnovato/learning-portal-fiori-sap.git
cd learning-portal-fiori-sap
npm install
npm start            # abre http://localhost:8080/index.html
```

A biblioteca OpenUI5 1.136 é baixada pelo UI5 CLI (definida em `ui5.yaml`) e servida localmente, sem CDN.

### Rotas

| Hash | Tela |
|---|---|
| `#/` | Resumo da jornada e catálogo com busca, filtro por status, ordenação e contagem |
| `#/trilha/{Id}` | Detalhe da trilha (Id inexistente mostra "Trilha não encontrada.") |

### Testes

```bash
npx playwright install chromium   # só na primeira vez
npm test
```

Roda os testes QUnit de `model/formatter.js`, `model/progress.js` e `model/resumo.js` (37 asserções) e 15 checagens no navegador: lista, resumo, ordenação, busca, detalhe, progresso salvo, teclado, falha ao carregar e rota inexistente. O CI roda o mesmo comando nos PRs para a `main` e para `developer/**`. Os testes QUnit também abrem em `http://localhost:8080/test/unit/unitTests.qunit.html`.

### Publicar (gratuito)

```bash
npm run build        # gera dist/ autocontido
```

O CI (`.github/workflows/ci.yml`) testa e gera o `dist/`. A publicação no GitHub Pages é manual: o workflow `deploy.yml` roda os testes antes de publicar. O Pages ainda não está ligado (#3).

### Em produção

- URL (ainda não publicada, #3): https://douglasabnovato.github.io/learning-portal-fiori-sap/
- Hospedagem: GitHub Pages (gratuito), publicado pelo GitHub Actions
- Passo a passo: [docs/DEPLOY.md](docs/DEPLOY.md)

### Dados

Edite `webapp/model/trilhas.json`. Informe só `ModulosCount` e `Concluidos`: o percentual e o status são derivados, não gravados.

---

## 🧩 Componentes SAPUI5 Utilizados

A aplicação atualmente utiliza diferentes componentes nativos do SAPUI5.

### Estrutura

```text
sap.m.Page
sap.m.VBox
sap.m.HBox
sap.m.Title
sap.m.Text
sap.m.Label
```

### Feedback

```text
sap.m.MessageStrip
sap.m.ObjectStatus
```

### Aprendizagem

```text
sap.f.GridContainer
sap.f.Card
sap.f.cards.Header
sap.m.ProgressIndicator
```

### Interação

```text
sap.m.Button
```

A biblioteca `sap.f` foi adicionada ao manifesto porque os Cards e o GridContainer fazem parte dessa biblioteca.

---

## 📈 Evolução da Interface

O projeto passou por uma evolução visual.

### Versão inicial

A interface utilizava uma listagem simples:

```text
┌──────────────────────────────────────────────┐
│ SAPUI5 & Fiori Foundation          Em Andamento │
├──────────────────────────────────────────────┤
│ ABAP Cloud & CDS Views             Não Iniciado │
├──────────────────────────────────────────────┤
│ SAP BTP & Extensões                Concluído    │
└──────────────────────────────────────────────┘
```

### Versão atual

A interface utiliza Cards:

```text
┌──────────────────────┐  ┌──────────────────────┐
│ SAPUI5 & Fiori       │  │ ABAP Cloud & CDS     │
│ Foundation           │  │ Views                │
│                      │  │                      │
│ Em Andamento         │  │ Não Iniciado        │
│                      │  │                      │
│ ███████████░ 75%     │  │ ░░░░░░░░░░░ 0%      │
│                      │  │                      │
│ 6 / 8 módulos        │  │ 0 / 6 módulos        │
│ 45 h                 │  │ 30 h                 │
│                      │  │                      │
│        Ver detalhes →│  │        Ver detalhes →│
└──────────────────────┘  └──────────────────────┘
```

Essa mudança tem como objetivo colocar o **progresso de aprendizagem** no centro da experiência.

---

# 🗺️ Roadmap

O projeto continuará evoluindo em etapas.

## Fase 1 — Fundação UX/UI

- [x] Estrutura inicial SAPUI5
- [x] Arquitetura MVC
- [x] Manifest configurado
- [x] JSONModel local
- [x] Internacionalização
- [x] Tema Fiori Horizon
- [x] Status semântico
- [x] ProgressIndicator
- [x] Cards de aprendizagem
- [x] Grid responsivo
- [ ] Refinamento de espaçamentos
- [ ] Refinamento de tipografia
- [ ] Refinamento dos estados visuais

---

## Fase 2 — Experiência de Aprendizagem

### Pesquisa

- [x] Adicionar `SearchField`
- [x] Implementar busca por título
- [x] Implementar filtros utilizando `Filter`
- [x] Criar estado visual para nenhum resultado

### Filtros

- [x] Criar filtro por status
- [ ] Exibir quantidade de trilhas por status
- [ ] Adicionar filtro de favoritos

### Ordenação

- [x] Ordenar por progresso
- [x] Ordenar por título
- [x] Ordenar por carga horária

### Favoritos

- [ ] Adicionar ação de favorito
- [ ] Persistir favoritos em `localStorage`
- [ ] Criar visualização de favoritos

---

## Fase 3 — Dashboard

Transformar a página inicial em um verdadeiro dashboard de aprendizagem.

Indicadores planejados:

```text
┌──────────────────┐
│ Trilhas          │
│       5          │
└──────────────────┘

┌──────────────────┐
│ Em andamento     │
│       2          │
└──────────────────┘

┌──────────────────┐
│ Concluídas       │
│       1          │
└──────────────────┘

┌──────────────────┐
│ Progresso geral  │
│      57%         │
└──────────────────┘
```

Feito em 03/11/2026: os quatro indicadores acima, horas estudadas e "Continuar" (próxima trilha recomendada).

Também estão previstos:

- progresso geral;
- horas estudadas;
- módulos concluídos;
- próxima trilha recomendada;
- trilha em destaque;
- resumo da jornada.

---

## Fase 4 — Navegação

Implementar navegação real entre as telas utilizando o Router do SAPUI5.

### Página inicial

```text
/
```

### Detalhes da trilha

```text
/trilha/{id}
```

Objetivos:

- [x] Configurar `routing` no `manifest.json`
- [x] Configurar targets
- [x] Criar rota para detalhes
- [x] Implementar `Detail.view.xml`
- [x] Implementar `Detail.controller.js`
- [x] Passar o ID da trilha pela rota
- [x] Substituir o fluxo de diálogo por navegação

---

## Fase 5 — Persistência e Dados

Evoluir progressivamente do modelo JSON local para uma arquitetura baseada em serviço.

Possibilidades futuras:

```text
JSONModel
    ↓
Mock / API
    ↓
OData V4
    ↓
SAP CAP
    ↓
SAP BTP
```

Essa etapa será implementada somente após a consolidação da experiência de usuário e da arquitetura atual.

---

## Fase 6 — Qualidade

Adicionar práticas de qualidade e engenharia de software.

### Testes

- [x] QUnit
- [ ] Testes de Controller
- [ ] Testes de Data Binding
- [ ] Testes de filtros
- [ ] OPA5
- [x] Testes de navegação

### Qualidade de código

- [ ] ESLint
- [ ] Prettier
- [ ] Padronização de nomenclatura
- [ ] Revisão de arquitetura

### Acessibilidade

- [ ] Revisar navegação por teclado
- [x] Revisar labels
- [ ] Revisar estados semânticos
- [x] Validar acessibilidade dos componentes

---

## Fase 7 — CI/CD

Automatizar o processo de desenvolvimento.

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ├── Lint
   │
   ├── Tests
   │
   ├── Build
   │
   └── Deploy
```

Objetivos:

- [x] Criar pipeline GitHub Actions
- [ ] Executar lint automaticamente
- [x] Executar testes automaticamente
- [x] Executar `ui5 build`
- [x] Rodar o CI nos PRs para a branch de sprint
- [ ] Gerar artefato de produção
- [ ] Automatizar deploy

---

# 📚 Conceitos SAPUI5 Estudados

Este projeto funciona também como laboratório de estudo dos seguintes conceitos:

- SAPUI5
- SAP Fiori
- Fiori Horizon
- MVC
- XML Views
- Controllers
- Component.js
- manifest.json
- Data Binding
- JSONModel
- ResourceModel
- i18n
- UI5 CLI
- `sap.m`
- `sap.f`
- Cards
- GridContainer
- ProgressIndicator
- ObjectStatus
- Responsive Design
- Routing
- OData
- Testes QUnit
- OPA5
- CI/CD

---

# 🎓 Objetivo Profissional

O projeto foi desenvolvido com foco em demonstrar conhecimentos práticos necessários para atuar no ecossistema SAPUI5/Fiori.

A intenção não é apenas criar uma interface visual, mas demonstrar a evolução de uma aplicação desde:

```text
Interface simples
       ↓
Arquitetura MVC
       ↓
Data Binding
       ↓
UX/UI Fiori
       ↓
Cards e Dashboard
       ↓
Routing
       ↓
API/OData
       ↓
Testes
       ↓
CI/CD
       ↓
SAP BTP
```

---

# 📌 Status do Projeto

**Em desenvolvimento ativo.**

O projeto encontra-se atualmente na etapa de evolução da experiência de usuário, com foco em:

- UX/UI;
- Cards;
- indicadores de progresso;
- responsividade;
- arquitetura SAPUI5;
- internacionalização.

---

# 👨‍💻 Autor

**Douglas A. B. Novato**

Projeto desenvolvido para estudo, portfólio e aprofundamento prático no desenvolvimento de aplicações com SAPUI5 e SAP Fiori.

---

## 📄 Licença

Este projeto é distribuído sob a licença ISC para fins educacionais e de portfólio profissional.

## Próximos passos

Estado do MVP em [`docs/MVP.md`](docs/MVP.md); plano em [`docs/PLANO-DE-ACAO.md`](docs/PLANO-DE-ACAO.md).

**Do responsável**

- #3: em Settings > Pages, escolher GitHub Actions como origem e rodar o workflow **Publicar**.
- #16: escolher a ferramenta de medição de uso, sem dados pessoais.
- #17: confirmar ou trocar a hipótese e a meta.

**Do agente**

- #15: medir LCP e acessibilidade no site publicado (depois da #3).
- #20: lista de módulos no detalhe da trilha.
- #18: favoritos.
- #19: ESLint e teste OPA5 no CI.
