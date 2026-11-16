# ADR-06: Aceitar os alertas de desenvolvimento do Dependabot

- **Status:** Aceita
- **Data:** 16/11/2026
- **Origem:** ordem do responsável repassada pelo DG líder em 16/11/2026:

> "Regra geral por ADR. alertas que nao atrapalham a producao, pode passar. os que atrapalham, entender, escolher a melhor estrategia para manter a funcionalidade"

## Contexto

Em 16/11/2026, 14h50, `gh api "repos/douglasabnovato/learning-portal-fiori-sap/dependabot/alerts?state=open&per_page=100"` deu 3 alertas abertos, todos de escopo de desenvolvimento e vindos do `@ui5/cli` 4.0.73, a ferramenta que serve, testa e gera o build do UI5. As correções só existem em versões maiores (`sigstore` 4, `@sigstore/core` 3, `minimatch` 11), e o `@ui5/cli` já está na versão mais nova da linha 4.

O caminho até o site:
- O `package.json` não tem `dependencies`; tudo está em `devDependencies` (`@ui5/cli`, `playwright`, `@axe-core/playwright`). `npm ls sigstore --omit=dev` e `npm ls minimatch --omit=dev` devolvem `(empty)`, e `npm audit --omit=dev` dá 0 vulnerabilidades.
- O site é o `dist/` gerado por `ui5 build self-contained --all` (`.github/workflows/deploy.yml` envia só o `dist`). O build junta o `webapp/` e as bibliotecas do OpenUI5 (`sap.m`, `sap.f`, `sap.ui.core`, tema Horizon). O `sigstore` vive no `pacote`, que o `@ui5/project` usa para baixar o OpenUI5 do npm durante o build; ele não é copiado para a saída.
- Prova: `npm run build` local em 16/11/2026 terminou com "Build succeeded"; `grep -rlI -i sigstore dist` e `grep -rlI -i minimatch dist` acharam 0 arquivos entre os 9.421 do `dist/`.

## Decisão

Aceitar os alertas abaixo, porque não chegam à produção.

| Alerta | Pacote | Severidade | Quem o puxa | Por que não chega à produção |
|---|---|---|---|---|
| #2 | sigstore 3.1.0 (GHSA-52v5-jr5w-gjxr) | alta | `@ui5/cli` → `@ui5/project` → `pacote` 19 | Só roda no `ui5 build`/`ui5 serve`, para baixar pacotes; 0 ocorrências no `dist/` |
| #1 | @sigstore/core 2.0.0 (GHSA-jfc7-64v2-mr8c) | média | mesmo caminho, dentro do `sigstore` 3 | idem |
| #20 | minimatch 9.0.9 (GHSA-g3hv-75wg-m249) | média | `@ui5/cli` → `@npmcli/map-workspaces`, `ignore-walk`, `@tufjs/models` e `glob` 10 (`devcert-sanscache`) | Usado para casar caminhos de arquivo nas ferramentas; 0 ocorrências no `dist/` |

Os alertas não são dispensados nem fechados pela API. Esta ADR só registra a decisão.

## Consequências

- O risco fica no ambiente de quem desenvolve e no CI (o `ui5 build` e o `ui5 serve`), não no site.
- `overrides` para versões maiores dentro do `@ui5/cli` ficam de fora: mudariam a ferramenta de build sem ganho para o site.

## Quando revisar

- Se algum desses pacotes passar a aparecer no `dist/` ou em `dependencies`.
- Se o `@ui5/cli` lançar versão (inclusive uma linha 5) com `pacote` 21 ou mais novo, que traz o `sigstore` 4.
- Numa migração da ferramenta de build do UI5.
