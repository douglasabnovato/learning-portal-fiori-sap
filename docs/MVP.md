# MVP — Learning Portal Fiori SAP

> Criado em 31/10/2026, com os critérios usados no `movies`. Situação baseada em `AVALIACAO.md` e na conferência deste ciclo.

## Problema e hipótese

**Problema e público:** Mostra domínio de SAPUI5 e Fiori em um portal de trilhas de aprendizagem que recrutadores podem abrir.

**Hipótese:** Quem avalia encontra uma trilha e vê o progresso dela em menos de 1 minuto. Proposta inicial, para o responsável confirmar ou trocar. Sem medição, a meta ainda não pode ser conferida.

## 1. Critérios

| # | Critério | Como verificar | Situação em 31/10/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial: meta proposta |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: fumaça no navegador passa; **sem demo** (#3) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: dados fixos em JSON |
| 5 | Medição de uso | A métrica principal é coletada | Não atende: nada coleta uso |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Não revisto neste ciclo |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não medido neste ciclo |
| 8 | Acessibilidade básica | Lighthouse e teclado | Parcial: controles nativos; não testado neste ciclo |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Atende: sem dados pessoais |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial: CI ativo; a publicação manual está em PR; `main` sem proteção |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 11 testes QUnit e fumaça no CI |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende |

**Resultado:** 5 de 12 critérios atendidos por inteiro. É um julgamento técnico.

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Criar a publicação manual no Pages | PR aberto |
| 2 | Ligar o Pages e rodar a publicação | Com o responsável (#3) |
| 3 | Salvar o progresso no navegador | Próximo ciclo |

## 3. Fora do MVP

OData real, SAP BTP e autenticação. A lista é uma proposta e pode mudar com a decisão do responsável.
