# MVP — Learning Portal Fiori SAP

> Criado em 31/10/2026. Revisto em 03/11, 10/11, 16/11 e 18/11/2026 (revisão de 18/11, 21h40: site no ar, LCP medido no link publicado, dist enxuto, celular, ESLint e OPA5). Este arquivo é a fonte única do estado.

**Nível:** Vitrine (N2). Os 12 critérios se aplicam.

**Resumo:** 10 de 12 aplicáveis atendidos

**Finalizado:** não — o 7 (LCP de 8,48 s no site, meta de 2,5 s) é trabalho de código, na #39. O 5 depende do responsável (conta do GoatCounter, #16, com `depende-do-responsavel`). Os 3 alertas do Dependabot seguem aceitos na [ADR-06](adr/0006-aceitar-alertas-de-desenvolvimento.md)

## Produto

- **Problema:** quem avalia precisa ver domínio de SAPUI5 e Fiori num portal de trilhas de aprendizagem que dá para abrir.
- **Público:** recrutadores e pessoas da área SAP que avaliam o portfólio.
- **Hipótese:** acreditamos que quem avalia o portfólio encontra uma trilha e vê o progresso dela sozinho. Saberemos quando uma pessoa de fora fizer o percurso "ache a trilha de Joule e veja o progresso" em menos de 1 minuto no site publicado (#27), e o GoatCounter mostrar as visitas e o evento `abrir-trilha` (#16).
- **Métrica:** tempo do percurso "ache a trilha de Joule e veja o progresso", medido por sessão observada no site publicado (#27), com visitas e `abrir-trilha` no GoatCounter (falta a conta, #16) — meta: menos de 1 minuto, decidida pelo coordenador em 10/11/2026 (D1), revisável pelo responsável (#17).

## Problema e hipótese

**Problema e público:** mostra domínio de SAPUI5 e Fiori em um portal de trilhas de aprendizagem que recrutadores e pessoas da área SAP podem abrir.

**Hipótese:** acreditamos que quem avalia o portfólio encontra uma trilha e vê o progresso dela sozinho. **Meta:** em menos de 1 minuto. **Saberemos quando** uma pessoa de fora fizer o percurso "ache a trilha de Joule e veja o progresso" em menos de 1 minuto no site publicado (#27), e o painel do GoatCounter mostrar as visitas e o evento `abrir-trilha` (#16). Meta decidida pelo coordenador em 10/11/2026 (decisão D1) e revisável pelo responsável (#17).

## 1. Critérios

Comandos rodados em 18/11/2026, na branch `feature/2026-11-18`, salvo indicação.

| # | Critério | Situação em 18/11/2026 | Evidência ou o que falta | Issue |
|---|---|---|---|---|
| 1 | Problema e público claros | Atende | Frase acima e `docs/PLANO-DE-ACAO.md` (ciclo de 16/11/2026) | — |
| 2 | Hipótese a validar | Atende | Hipótese acima, com meta numérica e "saberemos quando" | #17 (confirmação do responsável) |
| 3 | Fluxo principal completo | Atende | No navegador: `npm test` roda lista, busca, detalhe, progresso salvo, favoritos e teclado no Chromium, e o OPA5 (catálogo, busca "Joule", detalhe) passa com 3 asserções. No site, pela decisão D2 de 10/11/2026: `curl -s -o /dev/null -w "%{http_code}" https://douglasabnovato.github.io/learning-portal-fiori-sap/` deu 200, e `SITE_URL=https://douglasabnovato.github.io/learning-portal-fiori-sap/ npm run test:dist` passou nas 8 checagens (11 cards, busca, detalhe, F5, trilha inexistente, estado vazio, nenhuma requisição com erro, nada de `ui5.sap.com`) | #27 (validação com pessoa de fora) |
| 4 | Escopo enxuto | Atende | Dados fixos em JSON; seção "Fora do MVP" abaixo | — |
| 5 | Medição de uso | Parcial | Código pronto: GoatCounter sem cookie, só fora de `localhost`, com o evento `abrir-trilha`; os 3 testes da medição passam no `npm test`. Falta a conta: `curl -s https://douglasabnovato.goatcounter.com/` responde 400, "no site at this domain" | #16 (responsável) |
| 6 | Falhas tratadas | Atende | `npm test`: "busca vazia mostra o estado vazio", "sem favoritas mostra o estado vazio", "com favorita, busca vazia mostra o aviso comum", "id inexistente mostra aviso" e "falha ao carregar mostra aviso" (rota de `trilhas.json` abortada) passam; QUnit de armazenamento bloqueado em `progress.qunit.js` e `favoritos.qunit.js` | — |
| 7 | Desempenho aceitável | Não atende | Lighthouse 12.8.2 móvel no site publicado (build do commit `dfacceb`, run 43927298915 do **Publicar**), 4 execuções: LCP 8,59 / 8,39 / 8,48 / 8,83 s. Válidas as 3 com FCP observado abaixo de 2 s: mediana **8,48 s**, TBT de 1.248 a 1.670 ms. Elemento do LCP: a faixa de boas-vindas (`#__strip0-content`) ou o texto de um card. 91% do LCP é atraso de renderização: o `sap-ui-custom.js` tem 2,3 MB (600 KB com gzip) e o texto só aparece depois de o UI5 rodar | #39 |
| 8 | Acessibilidade básica | Atende | `npm test`: axe (WCAG 2.1 A e AA) sem violações na lista com as 11 trilhas reais em 1280 px, no detalhe, na trilha inexistente e na lista em 375 px (celular); detalhe aberto só com Tab e Enter; foco visível conferido no anel que o UI5 desenha (`.sapMFocusable::before`); lista de ordenação abre pelo teclado e fecha com Esc. No celular (375 px), nenhum elemento visível passa da borda na lista e no detalhe; a checagem achou o título cortado em "Minha jornada de apre..." e ele passou a quebrar a linha (#31). Lighthouse no site: acessibilidade 100 nas 4 execuções. O app não tem tema escuro próprio (só `sap_horizon`, sem `prefers-color-scheme`), então a segunda passada do axe é a do celular | — |
| 9 | Segurança e conformidade | Atende | `npm audit --omit=dev`: 0 vulnerabilidades (18/11/2026). `gh api "repos/douglasabnovato/learning-portal-fiori-sap/dependabot/alerts?state=open&per_page=100"` em 18/11/2026: 3 abertos (#1 `@sigstore/core`, #2 `sigstore` e #20 `minimatch`), os 3 na [ADR-06](adr/0006-aceitar-alertas-de-desenvolvimento.md), de desenvolvimento, fora do `dist/`. O ESLint novo não muda o `npm audit` completo (25 antes e depois). Sem segredo no código; sem dado pessoal (progresso e favoritos só no navegador) | #35 |
| 10 | Entrega confiável | Atende | `gh api repos/douglasabnovato/learning-portal-fiori-sap/rules/branches/main` em 18/11/2026: `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks`; o ruleset `principal-protegida` exige o check `verificar` | — |
| 11 | Testes dos fluxos críticos | Atende | `npm run lint`: 0 problemas. `npm test`: 49 asserções QUnit, 3 do OPA5 e 33 checagens no navegador, nenhuma pulada, sem esperas fixas (#33); 3 execuções seguidas verdes, em 34, 33 e 32 s (antes: 67 e 85 s). `npm run build` e `npm run test:dist`: 8 checagens no `dist/` servido em `/learning-portal-fiori-sap/`. O CI roda lint, testes, build e `test:dist` no job `verificar` | — |
| 12 | Documentação honesta | Atende | README: `npm start`, `npm run lint`, `npm test`, `npm run build` e `npm run test:dist` conferidos contra o `package.json`; o link do site responde 200 e abre o portal. `docs/DEPLOY.md` com o estado de 18/11/2026 e o tamanho do `dist/` | — |

**Atendidos:** 1, 2, 3, 4, 6, 8, 9, 10, 11 e 12. **Parcial:** 5. **Não atende:** 7.

**Por que "Finalizado: não":** o 7 não depende do responsável; o site está no ar e o LCP medido passa da meta. A causa e o plano estão na #39. O 5 depende da conta (#16).

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Publicação no Pages pelo Actions, travada por `PAGES_VIA_ACTIONS` | Feito (PR #5 e #28) |
| 2 | Ligar o Pages e criar a variável | Feito pelo responsável; conferido em 18/11/2026 (site 200, `PAGES_VIA_ACTIONS=true`) (#3) |
| 3 | Progresso salvo no navegador | Feito (#6) |
| 4 | Resumo da jornada, "Continuar" e ordenação | Feito (#13) |
| 5 | `main` protegida com o check `verificar` | Feito em 10/11/2026 (#14) |
| 6 | Medição sem cookie | Código feito em 10/11/2026; conta com o responsável (#16) |
| 7 | Favoritos e estado vazio corrigido | Feito em 16/11/2026 (#18, fecha no merge da `main`) |
| 8 | axe, foco visível e Esc no teste do navegador | Feito em 16/11/2026 |
| 9 | Medir LCP no ar | Medido em 18/11/2026: 8,48 s (#15); baixar para 2,5 s na #39 |
| 10 | Esperas por condição no teste do navegador | Feito em 18/11/2026 (#33) |
| 11 | Celular (375 px) no teste do navegador | Feito em 18/11/2026 (#31) |
| 12 | `dist/` enxuto e teste do build no subcaminho | Feito em 18/11/2026 (#30) |
| 13 | ESLint e OPA5 no CI | Feito em 18/11/2026 (#19) |

## 3. Fora do MVP

OData real, SAP BTP, autenticação e gráficos.

## Medições

- 18/11/2026, 21h: Lighthouse 12.8.2 móvel no site publicado, 4 execuções (LCP 8,59 / 8,39 / 8,48 / 8,83 s; FCP observado 2,53 / 1,37 / 1,97 / 1,65 s). Mediana das 3 válidas: 8,48 s. TBT 1.516 / 1.248 / 1.253 / 1.670 ms. Acessibilidade 100. Peso da página: cerca de 1,1 MB.
- 16/11/2026: sem site publicado, o LCP segue sem medida no link.
- 02/11/2026: Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.

## Histórico

- 20/11/2026: bloco Produto padronizado, sem mudar critérios.

### Revisão de 16/11/2026, 14h50 (antes da revisão de 18/11)

**Resumo:** 9 de 12 (1, 2, 4, 6, 8, 9, 10, 11 e 12). **Finalizado:** sim. O 3, o 5 e o 7 estavam "Parcial": o site dava 404, e o LCP não tinha medida no link. Em 18/11, com o site no ar, o 3 passou a "Atende" e o 7 a "Não atende" (8,48 s).

### Revisão de 16/11/2026, 14h50 (ADR dos alertas)

Ordem do responsável ("Regra geral por ADR"): os 3 alertas, todos do `@ui5/cli` e fora do `dist/`, ficam aceitos na ADR-06. O 9 vai para "Atende"; Resumo de 8 para 9 de 12; Finalizado de "não" para "sim".

### Revisão de 16/11/2026, 12h33 (alertas do Dependabot)

Antes: **Resumo** 8 de 12, **Finalizado:** sim, com o 9 em "Parcial" por alertas desligados (403, #29). Depois: alertas ligados, 3 abertos sem correção sem versão maior (#35). O 9 segue "Parcial" e o Finalizado cai para "não". Resumo segue 8 de 12.

### Estado de 10/11/2026, antes do ciclo de 16/11

**Resumo:** 8 de 12 (1, 2, 4, 6, 9, 10, 11 e 12). **Finalizado:** sim. Diferenças para a tabela atual: o 8 estava "Parcial" (sem axe); o 9 estava "Atende" só pelo `npm audit`, com o Dependabot desligado, o que a regra atual não aceita; o 6 citava a busca vazia, mas o estado vazio nunca aparecia.

### Estado de 10/11/2026, antes do ciclo da faixa de 90%

**Resumo:** 7 de 12 aplicáveis atendidos (1, 4, 6, 9, 10, 11 e 12). **Finalizado:** sim. O 2 estava "Parcial" e o 5 "Não atende".
