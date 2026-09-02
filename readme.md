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

## 🚀 Plano de Ação

* **Filtro de Pesquisa em Tempo Real (`SearchField`)**
  * [ ] **Etapa 1**: Adicionar o controle `SearchField` no arquivo `webapp/view/App.view.xml` logo acima da lista de trilhas.
  * [ ] **Etapa 2**: Implementar a função de captura do texto digitado no arquivo `webapp/controller/App.controller.js`.
  * [ ] **Etapa 3**: Configurar os filtros utilizando `sap/ui/model/Filter` e `FilterOperator` para buscar o termo no título.
  * [ ] **Etapa 4**: Aplicar os filtros dinamicamente no binding da listagem.

* **Página de Detalhes Dedicada (`Routing and Navigation`)**
  * [ ] **Etapa 1**: Configurar as rotas e alvos na seção `routing` do arquivo `webapp/manifest.json`.
  * [ ] **Etapa 2**: Criar a nova view de detalhes (`webapp/view/Detail.view.xml`) utilizando componentes como `ObjectHeader`.
  * [ ] **Etapa 3**: Desenvolver o controller de detalhes (`webapp/controller/Detail.controller.js`) para processar os parâmetros da rota.
  * [ ] **Etapa 4**: Substituir o modal atual pela navegação via roteador do SAPUI5 ao clicar em um item da lista.

* **Integração de Progresso Gráfico (`ProgressIndicator`)**
  * [ ] **Etapa 1**: Validar a propriedade numérica `Progresso` (0 a 100) no arquivo de dados `webapp/model/trilhas.json`.
  * [ ] **Etapa 2**: Adaptar o layout do item na view para acomodar componentes visuais adicionais.
  * [ ] **Etapa 3**: Inserir o componente nativo `ProgressIndicator` na interface.
  * [ ] **Etapa 4**: Realizar o *data binding* da propriedade `percentValue` diretamente com o valor do modelo.

## Licença

Este projeto é distribuído sob a licença ISC para fins educacionais e de portfólio profissional.