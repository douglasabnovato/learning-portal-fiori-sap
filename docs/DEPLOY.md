# Deploy · Learning Portal Fiori SAP

Como o portal vai ao ar no GitHub Pages, de graça. Revisto em 18/11/2026: o site está no ar, e o `dist/` ficou enxuto (#30).

## 1. Estado em 18/11/2026

- `curl -s -o /dev/null -w "%{http_code}" https://douglasabnovato.github.io/learning-portal-fiori-sap/`: **200**, com o `title` "Learning Portal Fiori SAP" e o `sap-ui-custom.js` do build.
- `gh api repos/douglasabnovato/learning-portal-fiori-sap/pages`: `build_type` **workflow**.
- `gh api repos/douglasabnovato/learning-portal-fiori-sap/actions/variables`: `PAGES_VIA_ACTIONS=true`.
- O run 43927298915 do **Publicar** (push na `main`, commit `dfacceb`, 16/11/2026) saiu `success`; o site serve esse build.
- `SITE_URL=https://douglasabnovato.github.io/learning-portal-fiori-sap/ npm run test:dist` em 18/11/2026: as 8 checagens passam no site (11 cards, busca, detalhe, F5, trilha inexistente, estado vazio, nenhuma requisição com erro, nada de `ui5.sap.com`).
- O site publicado ainda usa o build antigo, de cerca de 145 MB. O `dist/` enxuto vai ao ar no próximo merge na `main`.

## 2. Como funciona

| Peça | O que faz |
|---|---|
| `.github/workflows/ci.yml` | Em cada PR para a `main` ou para `developer/**` e em cada push na `main`: `npm ci`, instala o Chromium, `npm test`, `npm run build` e `npm run test:dist`. Job `verificar`, exigido pelo ruleset `principal-protegida` |
| `.github/workflows/deploy.yml` | Workflow **Publicar**. Roda em push na `main` só se `vars.PAGES_VIA_ACTIONS == 'true'`, ou à mão (`workflow_dispatch`). Repete os testes e o build e publica a pasta `dist/` com `actions/deploy-pages` |
| `npm run build` | `ui5 build self-contained --all --clean-dest` gera o `dist/` com a biblioteca OpenUI5 embutida, sem CDN. Depois, `scripts/enxugar-dist.cjs` tira o que o site não usa (ver seção 6) |
| `npm run test:dist` | `test/run-dist.cjs` serve o `dist/` em `/learning-portal-fiori-sap/`, com gzip, e confere no Chromium a lista, a busca, o detalhe, o F5, a trilha inexistente e o estado vazio, sem requisição com erro e sem `ui5.sap.com`. Com `SITE_URL`, faz o mesmo no site publicado |

Por que o app funciona no subcaminho `/learning-portal-fiori-sap/` sem mudar código:
- o `webapp/index.html` carrega `resources/sap-ui-core.js` por caminho relativo, e o build troca por `resources/sap-ui-custom.js` dentro do `dist/`;
- o `manifest.json` carrega `model/trilhas.json` e `i18n/` por caminho relativo;
- as rotas usam hash (`#/trilha/4`), então F5 e link direto funcionam sem `404.html`.

Medição: o `index.html` carrega o GoatCounter (`douglasabnovato.goatcounter.com`) só fora de `localhost`. Sem a conta (#16), o script carrega e nada é contado.

## 3. Passo a passo do responsável (#3)

Feito: conferido em 18/11/2026 (seção 1). O passo a passo fica como registro, para refazer a publicação num repositório novo.

1. Abrir https://github.com/douglasabnovato/learning-portal-fiori-sap/settings/pages.
2. Em **Build and deployment → Source**, escolher **GitHub Actions**. Não salvar nenhuma branch.
3. Abrir **Settings → Secrets and variables → Actions → aba Variables → New repository variable**.
4. Name: `PAGES_VIA_ACTIONS`. Value: `true`. Clicar em **Add variable**. Não há segredo a criar.
5. Abrir **Actions → Publicar → Run workflow**, branch `main`, e clicar em **Run workflow**. Esperar o job `publicar` ficar verde (cerca de 3 minutos).
6. Daí em diante, cada merge na `main` publica sozinho.

Alternativa por comando, no repositório `engenharia`: crie antes a variável (passos 3 e 4) e depois rode `DONO=douglasabnovato bash scripts/configurar-responsavel.sh pages learning-portal-fiori-sap`. O script liga o Pages e roda de novo o último workflow da `main`; sem a variável, esse run sai `skipped`.

## 4. Conferir no ar

1. `curl -s -o /dev/null -w "%{http_code}" https://douglasabnovato.github.io/learning-portal-fiori-sap/` responde 200.
2. Abrir o link: tema Horizon e 11 cards de trilhas.
3. Buscar "Joule": sobra 1 card. Abrir a trilha: a URL termina em `#/trilha/4`. Dar F5: o detalhe continua.
4. Abrir `.../#/trilha/999`: aparece "Trilha não encontrada.".
5. DevTools → Network: nada vem de `ui5.sap.com`; tudo vem de `/learning-portal-fiori-sap/resources/`.
6. Em **About → Website** do repositório, colar o link (opcional, do responsável).

Depois disso, o agente mede o LCP no site (#15) e o critério 7 pode sair de "Parcial".

## 5. Validar localmente

```bash
npm ci
npx playwright install chromium   # só na primeira vez
npm test                          # QUnit e checagens no navegador, com axe
npm run build                     # gera dist/ e tira o que o site não usa
npm run test:dist                 # serve dist/ em /learning-portal-fiori-sap/ e confere o app
```

As portas padrão são 8099 (`npm test`) e 8098 (`npm run test:dist`). Se estiverem ocupadas, troque com `TEST_PORT` e `DIST_PORT`.

## 6. Limites do plano gratuito e tamanho do `dist/`

- GitHub Pages: site público, até 1 GB, cerca de 100 GB de banda por mês.
- `--all` copia as bibliotecas inteiras: o `dist/` tinha 145 MB e 9.421 arquivos (`du -sh dist`, 18/11/2026).
- O `scripts/enxugar-dist.cjs` tira os mapas de código (`.map`), as fontes de depuração (`-dbg.js`), as fontes `.less`, os temas que o app não usa (`sap_hcb`, `sap_horizon_dark`, `sap_horizon_hcb` e `sap_horizon_hcw`) e as pastas de teste. Mantém todas as bibliotecas, os textos de todos os idiomas e o CLDR, que o UI5 pede conforme o idioma do navegador.
- Depois: **56 MB e 3.198 arquivos** (`du -sh dist` e `find dist -type f | wc -l`, 18/11/2026). O `npm run test:dist` passa com o `dist/` enxuto.
- Sem `--all`, o `dist/` cai para 5,5 MB, mas o tema e os módulos carregados sob demanda faltam e a lista não abre: o `npm run test:dist` falha. Por isso o build segue com `--all` e o enxugamento vem depois.

## 7. Segurança e LGPD

- Sem segredo e sem dado pessoal: as trilhas ficam em `webapp/model/trilhas.json`, público. Progresso e favoritos ficam só no `localStorage` do navegador de quem usa.
- A medição não usa cookie nem guarda dado pessoal.
