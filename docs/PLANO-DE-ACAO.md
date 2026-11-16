# Plano de ação — Learning Portal Fiori SAP

Timebox: 30 min.

| MoSCoW | Item | Ganho | Esforço | Status |
|---|---|---|---|---|
| Must | Routing real lista → detalhe (D1, D2) | Alto | Médio | ✅ |
| Must | Progresso derivado dos módulos (D3) | Alto | Baixo | ✅ |
| Should | i18n completo (D4) | Médio | Baixo | ✅ |
| Should | UI5 local, sem erro de console (D5) | Médio | Baixo | ✅ |
| Should | Testes QUnit + smoke (D6) | Alto | Médio | ✅ 2 testes (11 asserções) + 4 |
| Should | Busca, filtro por status, estado vazio (roadmap fase 2) | Médio | Baixo | ✅ |
| Should | Acessibilidade (D7) | Médio | Baixo | ✅ axe 0 |
| Could | Ordenação e favoritos (roadmap fase 2) | Médio | Baixo | Próximo ciclo |
| Could | Indicadores de dashboard (fase 3) | Médio | Médio | Próximo ciclo |
| Could | OPA5 e ESLint (fase 6) | Médio | Médio | Próximo ciclo |
| Won't | OData/CAP/BTP (fase 5) | — | Alto | Fora do escopo |

## Ciclo de 16/11/2026

> Branch `feature/2026-11-16` → `developer/sprint-2026-11-19` → `main`. Nível: Vitrine (N2), 12 critérios. O PR da sprint anterior (#26) foi mesclado na `main` em 16/11/2026.

### Produto

**Problema e público.** Recrutadores e pessoas da área SAP precisam ver, em pouco tempo, que o autor domina SAPUI5 e Fiori. O portal de trilhas é a prova.

**Hipótese e meta.** Acreditamos que quem avalia encontra uma trilha e vê o progresso dela em menos de 1 minuto. Saberemos quando o GoatCounter mostrar visitas e o evento `abrir-trilha` no site publicado, e quando uma pessoa de fora fizer o percurso em menos de 1 minuto (#27). Depende do Pages (#3) e da conta (#16).

**Estado no início do ciclo (16/11/2026).**
- `curl https://douglasabnovato.github.io/learning-portal-fiori-sap/`: 404. A API de Pages responde 404 (desligado).
- Dependabot: a API de alertas responde 403 (alertas desligados). Pela regra em decisão (engenharia#33), o critério 9 não fica "Atende" só pelo audit.
- `npm audit --omit=dev`: 0. `npm audit` completo: 32 (25 moderadas, 7 altas), todas de desenvolvimento (`@ui5/cli` e dependências).
- `npm test`: 37 asserções QUnit e 18 checagens no navegador. Não há axe: o critério 8 não tinha a evidência da régua.
- O `docs/DEPLOY.md` descrevia um workflow antigo (`ci/github-actions-ci.yml`, push direto na `main`).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Favorito como botão de alternância | No Fiori, o favorito é um botão que liga e desliga, com o ícone destacado quando marcado e um aviso curto (message toast) ao mudar. Virou um `ToggleButton` em cada card, com nome acessível e `MessageToast` | [SAP Fiori 1.136: Flag and Favorite](https://www.sap.com/design-system/fiori-design-web/v1-136/ui-elements/flag-and-favorite/usage) |
| axe dentro do teste do navegador | O Playwright recomenda o pacote `@axe-core/playwright` para rodar o axe na página aberta pelo teste e falhar com a lista de violações | [Playwright: accessibility testing](https://playwright.dev/docs/accessibility-testing) |
| O axe não pega tudo | A Deque diz que o axe encontra, em média, pouco mais da metade dos problemas da WCAG. Por isso o teste de teclado e o de foco visível continuam ao lado do axe | [axe-core (README)](https://github.com/dequelabs/axe-core) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Dependências de desenvolvimento em patch e minor (`@ui5/cli`, `playwright`) e `npm audit fix` sem `--force` | Médio | Baixo | Este ciclo |
| 2 | Critério 9 honesto (Parcial, alertas desligados) e issue para ligar os alertas | Alto | Baixo | Este ciclo |
| 3 | axe na lista, no detalhe e na trilha inexistente, com foco visível | Alto | Baixo | Este ciclo |
| 4 | Favoritos nas trilhas (#18) | Médio | Médio | Este ciclo |
| 5 | `docs/DEPLOY.md` refeito com o workflow atual | Médio | Baixo | Este ciclo |
| 6 | Ligar o Pages e a variável `PAGES_VIA_ACTIONS` | Alto | Baixo | Responsável (#3) |
| 7 | Medir LCP no site publicado | Médio | Baixo | Depois da #3 (#15) |
| 8 | Lista de módulos (#20), ESLint e OPA5 (#19) | Médio | Médio | Próximos ciclos |

**Fora do escopo.** OData real, SAP BTP, autenticação e gráficos.

### Engenharia

**Arquitetura.** OpenUI5 1.136 servido pelo UI5 CLI, MVC com XML Views e `JSONModel` local (`model/trilhas.json`). Progresso e favoritos ficam no `localStorage`, em módulos puros (`model/progress.js`, `model/favoritos.js`) testados com QUnit. O build `self-contained` gera o `dist/`, que o `deploy.yml` publica no Pages quando a variável `PAGES_VIA_ACTIONS` for `true`.

**Riscos.** Seletores do Playwright presos ao DOM do UI5, que muda entre versões. O `dist/` grande (~149 MB). O site só existe depois do responsável.

**Qualidade.** QUnit dos módulos; Playwright com axe (WCAG 2.1 A e AA) em largura de desktop e dados reais; teste de teclado e de foco visível. O app usa só o tema `sap_horizon`, sem tema escuro próprio: não há axe no escuro.

**Definição de pronto.** `npm test` e `npm run build` verdes no local e no CI; cada "Atende" do `docs/MVP.md` com comando, data e resultado.

### Plano de ação

**Este ciclo executa:** itens 1 a 5 do backlog, o `docs/MVP.md` e o README atualizados.

**Vira issue ou segue em issue:** Pages (#3), GoatCounter (#16), LCP no ar (#15), validação com pessoa de fora (#27), ligar os alertas do Dependabot (issue nova), lista de módulos (#20), ESLint e OPA5 (#19), reduzir o `dist/` (issue nova).

## Ciclo de 03/11/2026

> Branch `feature/2026-11-03` → `developer/sprint-2026-11-05` → `main`. Nível: Vitrine (N2), 12 critérios.

### Produto

**Problema e público.** Recrutadores e pessoas da área SAP precisam ver, em pouco tempo, que o autor domina SAPUI5 e Fiori. O portal de trilhas é a prova.

**Hipótese e meta.** Quem avalia encontra uma trilha e vê o progresso dela em menos de 1 minuto. A meta segue proposta; confirmar é do responsável (#17). Medir depende da publicação (#3) e de uma ferramenta (#16).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Cartões de KPI no topo da página | Fiori usa cartões com título e um número-chave em cor semântica (verde, vermelho, neutro). Virou o resumo da jornada, com números grandes e cor só onde há sentido (andamento e concluídas) | [SAP Fiori: analytical card](https://experience.sap.com/fiori-design-web/v1-50/analytical-card), [SAP Design System: cards](https://www.sap.com/design-system/btp/dna-design/components/cards/usage) |
| Progresso geral por módulos | Painéis de trilhas mostram trilhas iniciadas, taxa de conclusão e progresso médio. Escolhemos somar módulos, e não tirar a média das trilhas, para uma trilha curta não pesar igual a uma longa | [edyoucated: learning paths dashboard](https://help.edyoucated.org/en/articles/11600699-learning-paths-dashboard) |
| Visão do aluno é diferente da do professor | O aluno quer saber onde está e o que fazer a seguir. Virou o atalho "Continuar", que abre a trilha em andamento mais adiantada | [EUNIS 2018: Learning Scorecard Dashboards](https://repositorio.iscte-iul.pt/bitstream/10071/19776/1/EUNIS_2018_paper_80-Learning%20Scorecard%20Dashboards-%20visualizing%20student%20learning%20experience.pdf) |
| Foco visível e ordem de tabulação nativa | A SAP pede foco sempre visível e alerta que CSS ou JavaScript próprios de foco quebram a acessibilidade. Não mexemos no foco: usamos só controles nativos (`Select`, `Link`, `ObjectNumber`) e mantivemos o teste de teclado no CI | [Accessibility in SAP Fiori](https://www.sap.com/design-system/fiori-design-web/v1-142/discover/sap-design-system/product-standards/accessibility-in-sap-fiori), [UI5: recomendações gerais](https://ui5.github.io/docs/05_Developing_Apps/recommendations-ee37fc7.html) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Resumo da jornada e "Continuar" | Alto | Baixo | Este ciclo (#13) |
| 2 | Ordenar por título, progresso e carga horária | Médio | Baixo | Este ciclo (#13) |
| 3 | CI também nos PRs para a `developer` | Alto | Baixo | Este ciclo |
| 4 | Publicar no Pages | Alto | Baixo | Responsável (#3) |
| 5 | Proteger a `main` | Alto | Baixo | Responsável (#14) |
| 6 | Medir LCP e acessibilidade no ar | Médio | Baixo | Depois da #3 (#15) |
| 7 | Lista de módulos no detalhe | Médio | Médio | Issue (#20) |
| 8 | Favoritos | Médio | Médio | Issue (#18) |
| 9 | ESLint e OPA5 | Médio | Médio | Issue (#19) |
| 10 | Medição de uso | Médio | Médio | Responsável (#16) |

**Fora do escopo.** OData real, SAP BTP, autenticação, gráficos no resumo.

### Engenharia

**Arquitetura.** SPA OpenUI5 1.136 com tema `sap_horizon`, MVC com XML Views e roteamento por hash. Os dados vêm de `model/trilhas.json` (JSONModel). O progresso salvo fica no navegador (`model/progress.js`). O resumo e a ordenação são funções puras em `model/resumo.js`, usadas pelo `Master.controller.js`.

**Riscos.**
- O binding do UI5 não volta à ordem original com uma lista vazia de sorters. Resolvido com a chave "catalogo", que ordena pelo Id.
- O resumo é calculado no controller, não por binding: ele é refeito ao carregar e ao voltar do detalhe (rota `master`). Uma mudança de progresso feita em outro lugar exigiria refazer o cálculo.
- Sem proteção na `main`, um push direto publicaria sem CI (#14).

**Qualidade.**
- Testes: QUnit de `formatter`, `progress` e `resumo` (37 asserções) e 15 checagens no Chromium (lista, resumo, ordenação, busca, detalhe, progresso salvo, teclado, falha de rede, id inexistente).
- CI: agora também nos PRs para `developer/**`, que antes passavam sem verificação.
- Acessibilidade: só controles nativos; rótulos ligados por `labelFor` e `ariaLabelledBy`; teclado testado.
- Desempenho: sem medida no ar até a #3.
- Segurança: sem dados pessoais; nada novo vai para fora do navegador.

**Definição de pronto.** `npm ci`, `npm test` e `npm run build` passam; CI verde no PR; `docs/MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.**
1. Resumo da jornada (5 números) e atalho "Continuar", com testes.
2. Ordenação do catálogo, com testes.
3. CI nos PRs para a `developer`.
4. `docs/MVP.md` com o resumo batendo com a tabela; README com próximos passos.

**Vira issue.** #14, #15, #16, #17 (responsável); #18, #19, #20 (agente). A #3 segue aberta com o responsável.
