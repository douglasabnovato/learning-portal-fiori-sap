# Deploy · Learning Portal Fiori SAP

Como o portal vai ao ar no GitHub Pages, de graça. Revisto em 16/11/2026 para bater com os workflows atuais.

## 1. Estado em 16/11/2026

- `curl -s -o /dev/null -w "%{http_code}" https://douglasabnovato.github.io/learning-portal-fiori-sap/`: **404**.
- `gh api repos/douglasabnovato/learning-portal-fiori-sap/pages`: **404** (Pages desligado).
- O último run do workflow **Publicar** na `main` (43799508961, 16/11/2026) ficou como `skipped`: a variável `PAGES_VIA_ACTIONS` não existe.
- Ligar o Pages e criar a variável é do responsável (#3).

## 2. Como funciona

| Peça | O que faz |
|---|---|
| `.github/workflows/ci.yml` | Em cada PR para a `main` ou para `developer/**` e em cada push na `main`: `npm ci`, instala o Chromium, `npm test` e `npm run build`. Job `verificar`, exigido pelo ruleset `principal-protegida` |
| `.github/workflows/deploy.yml` | Workflow **Publicar**. Roda em push na `main` só se `vars.PAGES_VIA_ACTIONS == 'true'`, ou à mão (`workflow_dispatch`). Repete os testes e o build e publica a pasta `dist/` com `actions/deploy-pages` |
| `npm run build` | `ui5 build self-contained --all --clean-dest`: gera o `dist/` com a biblioteca OpenUI5 embutida, sem CDN |

Por que o app funciona no subcaminho `/learning-portal-fiori-sap/` sem mudar código:
- o `webapp/index.html` carrega `resources/sap-ui-core.js` por caminho relativo, e o build troca por `resources/sap-ui-custom.js` dentro do `dist/`;
- o `manifest.json` carrega `model/trilhas.json` e `i18n/` por caminho relativo;
- as rotas usam hash (`#/trilha/4`), então F5 e link direto funcionam sem `404.html`.

Medição: o `index.html` carrega o GoatCounter (`douglasabnovato.goatcounter.com`) só fora de `localhost`. Sem a conta (#16), o script carrega e nada é contado.

## 3. Passo a passo do responsável (#3)

1. Abrir https://github.com/douglasabnovato/learning-portal-fiori-sap/settings/pages.
2. Em **Build and deployment → Source**, escolher **GitHub Actions**. Não salvar nenhuma branch.
3. Abrir **Settings → Secrets and variables → Actions → aba Variables → New repository variable**.
4. Name: `PAGES_VIA_ACTIONS`. Value: `true`. Clicar em **Add variable**. Não há segredo a criar.
5. Abrir **Actions → Publicar → Run workflow**, branch `main`, e clicar em **Run workflow**. Esperar o job `publicar` ficar verde (cerca de 3 minutos).
6. Daí em diante, cada merge na `main` publica sozinho.

Alternativa por comando, no repositório `engenharia`: `DONO=douglasabnovato bash scripts/configurar-responsavel.sh pages learning-portal-fiori-sap`. A variável continua sendo criada à mão (passos 3 e 4).

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
npm run build                     # gera dist/
```

Para simular o subcaminho: copiar `dist/` para uma pasta `lp/learning-portal-fiori-sap/` e servir `lp/` com um servidor que comprime, como o Pages (`npx serve lp`).

## 6. Limites do plano gratuito

- GitHub Pages: site público, até 1 GB, cerca de 100 GB de banda por mês.
- O `dist/` tem cerca de 149 MB e 9.400 arquivos, porque `--all` copia as bibliotecas inteiras. Cabe no limite, mas atrasa o upload. Reduzir o build está numa issue própria.

## 7. Segurança e LGPD

- Sem segredo e sem dado pessoal: as trilhas ficam em `webapp/model/trilhas.json`, público. Progresso e favoritos ficam só no `localStorage` do navegador de quem usa.
- A medição não usa cookie nem guarda dado pessoal.
