# MVP — Learning Portal Fiori SAP

> Criado em 31/10/2026. Revisto em 03/11, 10/11 e 16/11/2026 (ciclo de 16/11, plano em `docs/PLANO-DE-ACAO.md`). Este arquivo é a fonte única do estado.

**Nível:** Vitrine (N2). Os 12 critérios se aplicam.

**Resumo:** 8 de 12 aplicáveis atendidos

**Finalizado:** sim — os 4 que faltam (3, 5, 7 e 9) dependem do responsável e têm issue com `depende-do-responsavel`: ligar o Pages (#3), criar a conta do GoatCounter (#16), medir no site depois da #3 (#15) e ligar os alertas do Dependabot (#29)

## Problema e hipótese

**Problema e público:** mostra domínio de SAPUI5 e Fiori em um portal de trilhas de aprendizagem que recrutadores e pessoas da área SAP podem abrir.

**Hipótese:** acreditamos que quem avalia o portfólio encontra uma trilha e vê o progresso dela sozinho. **Meta:** em menos de 1 minuto. **Saberemos quando** uma pessoa de fora fizer o percurso "ache a trilha de Joule e veja o progresso" em menos de 1 minuto no site publicado (#27), e o painel do GoatCounter mostrar as visitas e o evento `abrir-trilha` (#16). Meta decidida pelo coordenador em 10/11/2026 (decisão D1) e revisável pelo responsável (#17).

## 1. Critérios

Comandos rodados em 16/11/2026, na branch `feature/2026-11-16`, salvo indicação.

| # | Critério | Situação em 16/11/2026 | Evidência ou o que falta | Issue |
|---|---|---|---|---|
| 1 | Problema e público claros | Atende | Frase acima e `docs/PLANO-DE-ACAO.md` (ciclo de 16/11/2026) | — |
| 2 | Hipótese a validar | Atende | Hipótese acima, com meta numérica e "saberemos quando" | #17 (confirmação do responsável) |
| 3 | Fluxo principal completo | Parcial | `npm test`: o fluxo roda no Chromium (lista, busca, detalhe, progresso salvo, favoritos, teclado) e no CI (job `verificar`). Pela decisão D2 de 10/11/2026, falta o fluxo no site: `curl -s -o /dev/null -w "%{http_code}" https://douglasabnovato.github.io/learning-portal-fiori-sap/` deu 404 | #3 (responsável); #27 |
| 4 | Escopo enxuto | Atende | Dados fixos em JSON; seção "Fora do MVP" abaixo | — |
| 5 | Medição de uso | Parcial | Código pronto: GoatCounter sem cookie, só fora de `localhost`, com o evento `abrir-trilha`. `npm test`: "medição não carrega em localhost", "medição carrega no site com o código do portfólio" e "abrir a trilha conta o evento abrir-trilha" passam. Falta a conta e o painel com visitas | #16 (responsável) |
| 6 | Falhas tratadas | Atende | `npm test`: "busca vazia mostra o estado vazio", "sem favoritas mostra o estado vazio", "id inexistente mostra aviso" e "falha ao carregar mostra aviso" (rota de `trilhas.json` abortada) passam; QUnit de armazenamento bloqueado em `progress.qunit.js` e `favoritos.qunit.js`. O estado vazio da busca nunca aparecia (comparava o texto "0 trilhas" com 0) e foi corrigido neste ciclo | — |
| 7 | Desempenho aceitável | Parcial | Sem site no ar, não há Lighthouse no link publicado. Só medição local (ver "Medições") | #15 (espera a #3) |
| 8 | Acessibilidade básica | Atende | `npm test`: axe (WCAG 2.1 A e AA) sem violações na lista com as 11 trilhas reais em 1280 px, no detalhe e na trilha inexistente; detalhe aberto só com Tab e Enter; foco visível conferido no anel que o UI5 desenha (`.sapMFocusable::before`), com teste de mutação que falha sem ele; lista de ordenação abre pelo teclado e fecha com Esc. O app não tem tema escuro próprio (só `sap_horizon`), então não há axe no escuro | #31 (celular) |
| 9 | Segurança e conformidade | Parcial | `npm audit --omit=dev`: 0 vulnerabilidades. `npm audit`: 25 (21 moderadas, 4 altas), todas de desenvolvimento. `gh api "repos/douglasabnovato/learning-portal-fiori-sap/dependabot/alerts?state=open&per_page=100"`: 403, alertas desligados. Pela regra em decisão (engenharia#33), fica "Parcial" até os alertas existirem. Sem segredo no código; sem dado pessoal (progresso e favoritos só no navegador) | #29 (responsável) |
| 10 | Entrega confiável | Atende | `gh api repos/douglasabnovato/learning-portal-fiori-sap/rules/branches/main`: `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks`; o ruleset `principal-protegida` (ativo) exige o check `verificar` | — |
| 11 | Testes dos fluxos críticos | Atende | `npm test`: 49 asserções QUnit e 28 checagens no navegador, nenhuma pulada. No CI: ver o run do PR deste ciclo no README | — |
| 12 | Documentação honesta | Atende | README: `npm start`, `npm test` e `npm run build` conferidos contra o `package.json`; o link do site aparece como "ainda não publicado". `docs/DEPLOY.md` refeito com os workflows atuais | — |

**Atendidos:** 1, 2, 4, 6, 8, 10, 11 e 12. **Parciais:** 3, 5, 7 e 9.

**Por que "Finalizado: sim":** tudo o que o código resolve está feito. Os critérios 3, 5, 7 e 9 dependem do responsável (#3, #16, #15 e #29), todos com `depende-do-responsavel`.

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Publicação no Pages pelo Actions, travada por `PAGES_VIA_ACTIONS` | Feito (PR #5 e #28) |
| 2 | Ligar o Pages e criar a variável | Com o responsável (#3) |
| 3 | Progresso salvo no navegador | Feito (#6) |
| 4 | Resumo da jornada, "Continuar" e ordenação | Feito (#13) |
| 5 | `main` protegida com o check `verificar` | Feito em 10/11/2026 (#14) |
| 6 | Medição sem cookie | Código feito em 10/11/2026; conta com o responsável (#16) |
| 7 | Favoritos e estado vazio corrigido | Feito em 16/11/2026 (#18, fecha no merge da `main`) |
| 8 | axe, foco visível e Esc no teste do navegador | Feito em 16/11/2026 |
| 9 | Medir LCP no ar | Depois da #3 (#15) |

## 3. Fora do MVP

OData real, SAP BTP, autenticação e gráficos.

## Medições

- 16/11/2026: sem site publicado, o LCP segue sem medida no link.
- 02/11/2026: Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.

## Histórico

### Estado de 10/11/2026, antes do ciclo de 16/11

**Resumo:** 8 de 12 (1, 2, 4, 6, 9, 10, 11 e 12). **Finalizado:** sim. Diferenças para a tabela atual: o 8 estava "Parcial" (sem axe); o 9 estava "Atende" só pelo `npm audit`, com o Dependabot desligado, o que a regra atual não aceita; o 6 citava a busca vazia, mas o estado vazio nunca aparecia.

### Estado de 10/11/2026, antes do ciclo da faixa de 90%

**Resumo:** 7 de 12 aplicáveis atendidos (1, 4, 6, 9, 10, 11 e 12). **Finalizado:** sim. O 2 estava "Parcial" e o 5 "Não atende".
