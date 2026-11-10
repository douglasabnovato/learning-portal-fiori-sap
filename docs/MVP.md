# MVP — Learning Portal Fiori SAP

> Criado em 31/10/2026, com os critérios usados no `movies`. Revisto em 03/11/2026, no ciclo do processo por repositório. Este arquivo é a fonte única do estado.

**Nível:** Vitrine (N2). Os 12 critérios se aplicam.

**Resumo:** 7 de 12 aplicáveis atendidos

**Finalizado:** sim

**Estado em 10/11/2026:** 7 de 12 critérios atendidos (1, 4, 6, 9, 10, 11, 12); 4 parciais (2, 3, 8 e 7, que não foi medido) e 1 não atendido (5). O 10 passou a "Atende" em 10/11/2026: a `main` está protegida pelo ruleset `principal-protegida` (#14). Pela regra do ciclo, todo critério que não atende depende do responsável e tem issue aberta com o rótulo `depende-do-responsavel`: 2 (#17), 3 (#3), 5 (#16), 7 e 8 (#15, que espera a #3).

## Problema e hipótese

**Problema e público:** mostra domínio de SAPUI5 e Fiori em um portal de trilhas de aprendizagem que recrutadores podem abrir.

**Hipótese:** quem avalia encontra uma trilha e vê o progresso dela em menos de 1 minuto. Meta proposta, para o responsável confirmar ou trocar (#17). Sem medição, a meta ainda não pode ser conferida (#16).

## 1. Critérios

| # | Critério | Como verificar | Situação | Evidência | Data |
|---|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende | Frase acima e `docs/PLANO-DE-ACAO.md` | 03/11/2026 |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial: meta proposta, falta o responsável confirmar | #17 | 03/11/2026 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: o fluxo passa no navegador do CI; sem demo, ninguém de fora testou | #3; `npm test` | 03/11/2026 |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: dados fixos em JSON; fora do MVP listado abaixo | Seção 3 | 03/11/2026 |
| 5 | Medição de uso | A métrica principal é coletada | Não atende: nada coleta uso | #16 | 03/11/2026 |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: busca vazia, trilha inexistente, falha ao carregar e armazenamento bloqueado têm resposta | `test/run-qunit.cjs`, `progress.qunit.js` | 03/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Parcial: não medido, sem site no ar | #15 (espera a #3) | 03/11/2026 |
| 8 | Acessibilidade básica | Lighthouse e teclado | Parcial: abrir o detalhe por teclado tem teste no CI; só controles nativos; Lighthouse no ar não medido | #15 | 03/11/2026 |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Atende: sem dados pessoais; varredura de segredos sem achado | `git grep` do guia de estado | 03/11/2026 |
| 10 | Entrega confiável | Publicação só depois de CI verde | Atende: `gh api repos/douglasabnovato/learning-portal-fiori-sap/rulesets`, em 10/11/2026: ruleset `principal-protegida` ativo (exige PR, bloqueia force push e exclusão); workflow `CI` roda nos PRs para `main` e `developer/**`; `deploy.yml` testa antes de publicar | `gh api repos/douglasabnovato/learning-portal-fiori-sap/rules/branches/main` (deletion, non_fast_forward, pull_request); #14 | 10/11/2026 |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 37 asserções QUnit e 15 checagens no navegador | CI do PR do ciclo | 03/11/2026 |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende: README e este resumo revistos | Este arquivo, `readme.md` | 03/11/2026 |

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Criar a publicação manual no Pages | Feito (PR #5) |
| 2 | Ligar o Pages e rodar a publicação | Com o responsável (#3) |
| 3 | Salvar o progresso no navegador | Feito (#6) |
| 4 | Resumo da jornada, "Continuar" e ordenação | Feito (#13) |
| 5 | CI nos PRs para a `developer` | Feito neste ciclo |
| 6 | Proteger a `main` | Feito em 10/11/2026 (#14) |
| 7 | Medir LCP e acessibilidade no ar | Depois da #3 (#15) |

## 3. Fora do MVP

OData real, SAP BTP, autenticação e gráficos. A lista é uma proposta e pode mudar com a decisão do responsável.

## Medições

- 03/11/2026: sem site publicado, o LCP segue sem medida.
- 02/11/2026: Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.
