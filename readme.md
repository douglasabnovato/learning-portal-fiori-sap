# Learning Portal Fiori SAP

Learning Portal Fiori SAP é uma aplicação web moderna desenvolvida para fins de portfólio, estruturada com SAPUI5 e baseada nos padrões de design do SAP Fiori Horizon. O projeto simula um portal corporativo de trilhas de aprendizado tecnológico, utilizando arquitetura Model-View-Controller (MVC) e consumo de dados locais via OData/JSON mock.

## Tecnologias Utilizadas

* SAPUI5 & SAP Fiori: Framework oficial para construção de aplicações web corporativas responsivas.
* UI5 CLI Tooling: Ferramenta de linha de comando para execução, build e testes locais.
* Node.js & npm: Gerenciamento de pacotes e dependências de desenvolvimento.
* JavaScript (ES6+) & XML: Estruturação lógica e de interfaces declarativas.

## Estrutura do Projeto

```bash
learning-portal-fiori-sap/
├── node_modules/
├── webapp/
│   ├── controller/
│   │   └── App.controller.js
│   ├── model/
│   │   └── trilhas.json
│   ├── view/
│   │   └── App.view.xml
│   ├── Component.js
│   ├── index.html
│   └── manifest.json
├── package.json
├── package-lock.json
└── ui5.yaml
```

## Como Executar o Projeto Localmente

1. Certifique-se de ter o Node.js instalado em sua máquina.
2. Clone o repositório e navegue até a pasta raiz do projeto.
3. Instale as dependências locais utilizando o comando:
   npm install
4. Inicie o servidor de desenvolvimento local executando:
   ui5 serve
5. Abra o navegador e acesse a URL:
   http://localhost:8080/index.html

## Funcionalidades

* Listagem Dinâmica: Consumo reativo de dados através de Data Binding conectados a arquivos JSON estruturados.
* Identidade Visual Fiori: Utilização de componentes nativos seguindo o padrão Fiori Horizon.
* Formatação Condicional de Status: Cores e estados visuais dinâmicos baseados no progresso de cada trilha de estudo.
* Interatividade via Diálogo Modais: Eventos de clique customizados no controller para exibição de detalhes técnicos e modais informativos.

## Licença

Este projeto é distribuído sob a licença ISC para fins educacionais e de portfólio profissional.