# Learning Portal Fiori SAP

Aplicação web desenvolvida com **SAPUI5** e **SAP Fiori**, criada como projeto de portfólio e laboratório prático para desenvolvimento de aplicações corporativas com UI5.

O projeto simula um **portal de aprendizagem tecnológica**, permitindo visualizar trilhas de formação, acompanhar progresso, consultar informações e explorar conceitos de desenvolvimento utilizando os padrões e componentes nativos do ecossistema SAPUI5.

---

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

O percentual é obtido diretamente do modelo:

```xml
percentValue="{Progresso}"
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
        App.view.xml              App.controller.js
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

### 1. Pré-requisitos

Tenha instalado:

- Node.js
- npm
- UI5 CLI

---

### 2. Clonar o projeto

```bash
git clone https://github.com/douglasabnovato/learning-portal-fiori-sap.git
```

Entre na pasta:

```bash
cd learning-portal-fiori-sap
```

---

### 3. Instalar dependências

```bash
npm install
```

---

### 4. Iniciar o servidor

```bash
ui5 serve
```

O UI5 Server é o fluxo recomendado para desenvolvimento local; o build é utilizado posteriormente para gerar a aplicação otimizada para distribuição/deploy. :contentReference[oaicite:1]{index=1}

---

### 5. Acessar a aplicação

Abra:

```text
http://localhost:8080
```

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

- [ ] Adicionar `SearchField`
- [ ] Implementar busca por título
- [ ] Implementar filtros utilizando `Filter`
- [ ] Criar estado visual para nenhum resultado

### Filtros

- [ ] Criar filtro por status
- [ ] Exibir quantidade de trilhas por status
- [ ] Adicionar filtro de favoritos

### Ordenação

- [ ] Ordenar por progresso
- [ ] Ordenar por título
- [ ] Ordenar por carga horária

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

- [ ] Configurar `routing` no `manifest.json`
- [ ] Configurar targets
- [ ] Criar rota para detalhes
- [ ] Implementar `Detail.view.xml`
- [ ] Implementar `Detail.controller.js`
- [ ] Passar o ID da trilha pela rota
- [ ] Substituir o fluxo de diálogo por navegação

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

- [ ] QUnit
- [ ] Testes de Controller
- [ ] Testes de Data Binding
- [ ] Testes de filtros
- [ ] OPA5
- [ ] Testes de navegação

### Qualidade de código

- [ ] ESLint
- [ ] Prettier
- [ ] Padronização de nomenclatura
- [ ] Revisão de arquitetura

### Acessibilidade

- [ ] Revisar navegação por teclado
- [ ] Revisar labels
- [ ] Revisar estados semânticos
- [ ] Validar acessibilidade dos componentes

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

- [ ] Criar pipeline GitHub Actions
- [ ] Executar lint automaticamente
- [ ] Executar testes automaticamente
- [ ] Executar `ui5 build`
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