# MVP — Learning Portal Fiori SAP

> Criado em 31/10/2026, com os critérios usados no `movies`. Revisto em 03/11/2026 e em 10/11/2026 (ciclo da faixa de 90%, decisões D1 a D7 em `engenharia/decisoes/2026-11-10-ciclo-faixa-90.md`). Este arquivo é a fonte única do estado.

**Nível:** Vitrine (N2). Os 12 critérios se aplicam.

**Resumo:** 8 de 12 aplicáveis atendidos

**Finalizado:** sim — faltam 3, 5, 7 e 8, que dependem do responsável: ligar o Pages (#3) e criar a conta do GoatCounter (#16); depois, medir no site (#15)

## Problema e hipótese

**Problema e público:** mostra domínio de SAPUI5 e Fiori em um portal de trilhas de aprendizagem que recrutadores podem abrir.

**Hipótese (meta do ciclo, texto da proposta mantido):** quem avalia encontra uma trilha e vê o progresso dela em menos de 1 minuto. Saberemos pelo GoatCounter: visitas ao site e o evento `abrir-trilha`, depois que o Pages estiver ligado.

## 1. Critérios

| # | Critério | Situação em 10/11/2026 | Evidência ou o que falta | Issue |
|---|---|---|---|---|
| 1 | Problema e público claros | Atende | Frase acima e `docs/PLANO-DE-ACAO.md` | — |
| 2 | Hipótese a validar | Atende | Meta decidida pelo coordenador em 10/11/2026 (decisão D1), revisável pelo responsável: a hipótese acima | #17 |
| 3 | Fluxo principal completo | Parcial | `npm test` (Playwright + QUnit), 10/11/2026: 37 asserções QUnit e 18 de 18 checagens no navegador (lista, busca, detalhe, progresso, teclado, falha de rede, medição); roda no CI (job `verificar`). Falta o site: `curl https://douglasabnovato.github.io/learning-portal-fiori-sap/`, 10/11/2026: 404 (Pages desligado) | #3 (responsável); validação com pessoa de fora: #27 |
| 4 | Escopo enxuto | Atende | Dados fixos em JSON; fora do MVP na seção 3 | — |
| 5 | Medição de uso | Parcial | Código pronto; falta a conta (decisão D5). GoatCounter sem cookie no `webapp/index.html`, só fora de localhost; o detalhe conta o evento `abrir-trilha`. `npm test`, 10/11/2026: "medição não carrega em localhost", "medição carrega no site com o código do portfólio" e "abrir a trilha conta o evento abrir-trilha" passam | #16 (responsável) |
| 6 | Falhas tratadas | Atende | Busca vazia, trilha inexistente, falha ao carregar e armazenamento bloqueado têm resposta (`test/run-qunit.cjs`, `progress.qunit.js`; `npm test`, 10/11/2026: ok) | — |
| 7 | Desempenho aceitável | Parcial | Não medido: sem site no ar (D6) | #15 (espera a #3) |
| 8 | Acessibilidade básica | Parcial | Abrir o detalhe por teclado tem teste no CI; só controles nativos. Falta axe e Lighthouse no site publicado | #15 (espera a #3) |
| 9 | Segurança e conformidade | Atende | Sem dados pessoais; medição sem cookie e sem dado pessoal. `npm audit --omit=dev`, 10/11/2026: 0 vulnerabilidades; Dependabot desligado (API 403) | — |
| 10 | Entrega confiável | Atende | `gh api repos/douglasabnovato/learning-portal-fiori-sap/rules/branches/main`, 10/11/2026: `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks` (`verificar`). O `deploy.yml` testa e gera o build antes de publicar e só roda na `main` com `PAGES_VIA_ACTIONS=true` | #14 (feita) |
| 11 | Testes dos fluxos críticos | Atende | CI do PR do ciclo: 37 asserções QUnit e 18 checagens no navegador, sem `skip` | — |
| 12 | Documentação honesta | Atende | README e este arquivo dizem que o site não está no ar | — |

**Atendidos:** 1, 2, 4, 6, 9, 10, 11 e 12. **Parciais:** 3, 5, 7 e 8.

**Por que "Finalizado: sim":** tudo o que o código resolve está feito. Os critérios 3, 5, 7 e 8 dependem do responsável (#3, #16 e #15, que espera a #3), com o rótulo `depende-do-responsavel`.

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Criar a publicação manual no Pages | Feito (PR #5) |
| 2 | Ligar o Pages e rodar a publicação | Com o responsável (#3) |
| 3 | Salvar o progresso no navegador | Feito (#6) |
| 4 | Resumo da jornada, "Continuar" e ordenação | Feito (#13) |
| 5 | CI nos PRs para a `developer` | Feito neste ciclo |
| 6 | Proteger a `main` | Feito em 10/11/2026 (#14) |
| 7 | Medição sem cookie e publicação automática travada por variável | Feito em 10/11/2026 (ciclo da faixa de 90%) |
| 8 | Medir LCP e acessibilidade no ar | Depois da #3 (#15) |

## 3. Fora do MVP

OData real, SAP BTP, autenticação e gráficos. A lista é uma proposta e pode mudar com a decisão do responsável.

## Medições

- 03/11/2026: sem site publicado, o LCP segue sem medida.
- 02/11/2026: Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.

## Histórico

### Estado de 10/11/2026, antes do ciclo da faixa de 90%

**Resumo:** 7 de 12 aplicáveis atendidos (1, 4, 6, 9, 10, 11 e 12). **Finalizado:** sim. Diferenças para a tabela atual: o 2 estava "Parcial" (meta proposta, sem decisão) e o 5 "Não atende" (nada coletava uso). O 10 atendia sem a exigência dos jobs do CI.
