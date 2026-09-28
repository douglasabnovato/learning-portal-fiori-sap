# Análise — Learning Portal Fiori SAP

Ciclo: lote 2 · stack original mantida (OpenUI5/SAPUI5, decisão sua) · grupo da rubrica: front-end.

## Diagnóstico do original

| # | Defeito | Impacto | Correção |
|---|---|---|---|
| D1 | `Detail.view.xml` e `Detail.controller.js` existiam, mas o `manifest.json` não tinha `routing` | Código morto; o detalhe abria num diálogo montado à mão | Router com rotas `""` → master e `trilha/{trilhaId}` → detail |
| D2 | Detalhe buscava a trilha pelo índice do array | Link quebrava se a ordem do JSON mudasse | Busca por `Id`; página "Trilha não encontrada." |
| D3 | `Progresso` e `Status` gravados no JSON divergiam dos módulos (ex.: Id 4 com 30% para 1/4) | Informação errada na tela | `model/formatter.js` calcula tudo a partir de `Concluidos/ModulosCount` |
| D4 | Textos em português fixos na view de detalhe | i18n incompleto (en mostrava português) | Todas as strings em `i18n*.properties` |
| D5 | UI5 carregado do CDN e `GridContainer rowSize="auto"` | Erro no console; app não abre offline | UI5 servido localmente pelo `ui5 serve`/build; `rowSize` removido |
| D6 | `npm test` = "no test" | Nenhuma rede de segurança | QUnit do formatter + smoke Playwright |
| D7 | Filtro por status sem nome acessível | Leitor de tela não anuncia o controle | `Label` associado |
| D8 | README com resíduo de ferramenta (`contentReference[oaicite…]`) | Descuido visível no portfólio | Removido |

## Evidências (depois)

- `npm test`: QUnit 2 testes (11 asserções); smoke: 11 cards, busca "Joule" → 1 card, `#/trilha/4` abre detalhe, `#/trilha/999` mostra não encontrado.
- axe-core: 0 violações na lista e no detalhe.
- `npm audit`: 7 alertas (3 moderados, 4 altos), todos transitivos de `@ui5/cli` (pacote/sigstore), só em desenvolvimento, sem correção na 4.x.

## Rubrica v2 (grupo front-end)

Aprovação: média ponderada ≥ 7,0 **e** C1 e C4 (eliminatórios) ≥ 5. Regras: nota sem evidência vale no máximo 6; C1 limitado a 7 para parte não executada de ponta a ponta; C9 ≥ 8 só com URL publicada e CI verde.

| # | Critério | Referência | Peso | Antes | Depois | Evidência | Justificativa |
|---|---|---|---|---|---|---|---|
| C1 | Núcleo de valor | MVP (Ries); SWEBOK Requirements | 17% | 6 | 8 | Smoke Playwright: 11 cards, busca, detalhe #/trilha/4 | Fluxo lista → detalhe executado; sem persistência de progresso |
| C2 | Estados e condições excepcionais | Nielsen; OWASP A10:2025 | 10% | 3 | 8 | Smoke: #/trilha/999 → 'Trilha não encontrada.'; lista vazia com IllustratedMessage | Não encontrado, vazio e filtro cobertos |
| C3 | Acessibilidade | WCAG 2.2 AA (axe-core) | 11% | 5 | 8 | axe-core: 0 violações (lista e detalhe) | Label no filtro, lang pt-BR, tooltip nos botões |
| C4 | Segurança e privacidade | OWASP Top 10:2025 / ASVS 5.0 N1 | 10% | 6 | 7 | Sem backend; CSP n/a; audit: 7 vulnerabilidades só em dev (@ui5/cli) | Front estático sem dados sensíveis; dependências de dev com alertas sem correção na 4.x |
| C5 | Dados | 3FN / ACID / fonte única | 3% | 4 | 8 | formatter.js deriva progresso de Concluidos/ModulosCount | Antes: Progresso gravado divergia dos módulos (ex.: 30% para 1/4) |
| C6 | Testes | Pirâmide de testes; SWEBOK Testing | 9% | 0 | 7 | `npm test`: QUnit 2 testes (11 asserções) + 4 checks de smoke | Antes: script de teste inexistente. Auditoria: são 2 testes QUnit com 11 asserções (só o formatter) + 4 checagens de fumaça |
| C7 | Qualidade de código | SOLID / camadas; SWEBOK Construction | 8% | 5 | 8 | Master/Detail + formatter; sem strings fixas | Antes: Detail era código morto (sem routing) e usava índice do array |
| C8 | Desempenho | Complexidade; Core Web Vitals | 7% | 5 | 7 | UI5 local (sem CDN); build self-contained | Antes: dependia do CDN e GridContainer gerava erro de rowSize |
| C9 | Operação | 12-Factor; DORA | 6% | 4 | 7 | ci/github-actions-ci.yml (não executado no GitHub); sem URL publicada | C9 ≤ 7 sem URL e CI verde |
| C10 | Documentação | README como contrato | 5% | 7 | 8 | README: rodar, testar, publicar | Removido artefato 'contentReference' do README |
| C11 | Produto e evidência | Cagan (4 riscos); Torres | 8% | 6 | 7 | Roadmap das fases 2, 4 e 6 cumprido em parte | Sem métrica de uso; portfólio |
| C12 | Sustentabilidade técnica | OWASP A03:2025; SWEBOK Maintenance | 6% | 6 | 7 | OpenUI5 1.136 LTS; specVersion 4.0 | Dependências de dev com alertas transitivos |

**Média ponderada:** antes **4,77** (REPROVADO) → depois **7,54** (APROVADO).

