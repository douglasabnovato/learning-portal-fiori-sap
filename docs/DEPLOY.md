# Deploy · Learning Portal Fiori SAP

Plano de ação para publicar o portal de trilhas em OpenUI5 em hospedagem gratuita.

## 1. Desafio

Publicar um app OpenUI5 (Fiori Horizon, roteamento por hash) cujo build `self-contained` gera uma pasta `dist/` com a biblioteca UI5 embutida, sem servidor próprio, com deploy automático e sem custo, funcionando dentro do subcaminho `/learning-portal-fiori-sap/` do GitHub Pages.

## 2. Conteúdo

### Decisão de hospedagem

| Opção | Resultado |
|---|---|
| **GitHub Pages publicado pelo GitHub Actions (escolhida)** | Gratuito, no mesmo lugar do código; o workflow que já testa e gera o `dist/` passa a publicar a `main` |
| Netlify (arrastar `dist/`) | Funciona, mas é manual a cada versão e exige outra conta |
| SAP BTP (trial) | Seria o ambiente "oficial" de Fiori, mas o trial expira e exige configuração de subconta; não compensa para um portfólio estático |

URL esperada: **https://douglasabnovato.github.io/learning-portal-fiori-sap/**

### Por que o app já funciona no subcaminho (sem mudar código)

- **Bootstrap do UI5**: o `webapp/index.html` não usa mais o CDN (`ui5.sap.com`). Ele carrega `resources/sap-ui-core.js` com **caminho relativo**, e o build `self-contained` troca por `resources/sap-ui-custom.js` dentro do próprio `dist/`. No teste, nenhuma requisição saiu para fora do site.
- **Caminhos relativos**: `data-sap-ui-resource-roots` aponta para `./` e o `manifest.json` carrega `model/trilhas.json` e `i18n/` de forma relativa, então tudo resolve dentro de `/learning-portal-fiori-sap/`.
- **Rotas por hash** (`#/trilha/4`): o servidor só recebe `/learning-portal-fiori-sap/`, então deep link e F5 funcionam sem `404.html`.

### O que foi ajustado

| Arquivo | Ajuste | Por quê |
|---|---|---|
| `ci/github-actions-ci.yml` | O job `test` (Node 22, já existente) agora também envia o `dist/` como artefato do Pages, e um novo job `deploy` publica (só em push na `main`) | Publicação automática a cada push |
| `readme.md` | Seção "Publicar" atualizada e seção "Em produção" | Link do site e deste passo a passo (o texto antigo mandava arrastar o `dist/` no Netlify) |

Validação feita antes da entrega (sandbox, Node 22):

- `npm ci` limpo; `npm test`: **QUnit 11 ok, 0 falhas** + smoke test com 4 checagens (11 cards, busca, detalhe pelo Id, id inexistente); `npm run build` gera o `dist/` (1,1 min).
- `npm audit --omit=dev`: **0 vulnerabilidades**. `npm audit` completo: **7 alertas (3 moderados, 4 altos) só de desenvolvimento**, vindos do `@ui5/cli`; `npm audit fix` sem `--force` não resolve nenhum (antes 7 → depois 7), e o `--force` seria upgrade major, então não apliquei. Não vão para o site publicado.
- `dist/` servido por um servidor que imita o Pages em `/learning-portal-fiori-sap/`, aberto no Chromium com Playwright: 11 cards, clique abre `#/trilha/1`, abrir `#/trilha/4` direto mostra "AI Assistant - Joule & GenAI", endereço sem barra final redireciona para `/learning-portal-fiori-sap/`, nenhuma requisição externa.

### Limitações do plano gratuito

- GitHub Pages: site público, até 1 GB, cerca de 100 GB de banda por mês; o repositório precisa ser público no plano gratuito.
- O `dist/` tem cerca de **149 MB e 9.400 arquivos**, porque `ui5 build self-contained --all` copia as bibliotecas inteiras (`resources/`). Cabe no limite do Pages, mas o upload do artefato leva alguns segundos a mais. O navegador só baixa o que usa (o `sap-ui-custom.js` já junta o necessário).
- O único erro no console é o `favicon.ico` que o navegador procura na raiz do domínio (o `index.html` não declara ícone). É estético e já acontecia antes.

### Segurança e LGPD

- Não há segredo nem dado pessoal: as trilhas ficam em `webapp/model/trilhas.json`, público.

### Decisões pendentes (para você validar)

1. **Tamanho do `dist/`**: dá para reduzir bastante publicando só o que o app usa (tirando `--all` ou filtrando `resources/`), mas isso muda o build e pede novo teste dos temas. Não mexi. Diga se quer que eu teste essa otimização.
2. **Favicon**: opcional, adicionar um ícone em `webapp/` e um `<link rel="icon">` no `index.html` para acabar com o 404 do console.

## 3. Solução (passo a passo)

### Etapa 1 · Validar localmente (Git Bash)

1. `cd /c/ambiente-projeto/ser-mvp/learning-portal-fiori-sap`
2. `npm ci` (se reclamar do lockfile, `npm install` e depois `npm ci` de novo)
3. `npx playwright install chromium` (só na primeira vez)
4. `npm test` (QUnit + smoke)
5. `npm run build` e conferir que `dist/index.html` e `dist/resources/sap-ui-custom.js` existem.
6. Opcional, simular o subcaminho: `mkdir -p /tmp/lp && rm -rf /tmp/lp/learning-portal-fiori-sap && cp -r dist /tmp/lp/learning-portal-fiori-sap && npx http-server /tmp/lp -p 8081`, depois abrir `http://localhost:8081/learning-portal-fiori-sap/`.

### Etapa 2 · Ligar o GitHub Pages (antes do push)

1. No repositório `learning-portal-fiori-sap` no GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Não é preciso criar variável nem segredo.

### Etapa 3 · Subir para o GitHub

1. Nada a remover com `git rm` (conforme PENDENCIAS).
2. Mover o workflow:
   ```bash
   mkdir -p .github/workflows && mv ci/github-actions-ci.yml .github/workflows/ci.yml && rmdir ci
   ```
3. `git status` (nenhum `dist/`, `resources/` ou `node_modules/` pode aparecer; o `.gitignore` já cobre)
4. `git add -A`
5. `git commit -m "chore: deploy do dist/ no GitHub Pages pelo workflow"`
6. `git push origin main`
7. Aba **Actions**: o workflow "ci" precisa ficar verde nos jobs `test` e `deploy`.

### Etapa 4 · Conferir no ar

1. Abrir https://douglasabnovato.github.io/learning-portal-fiori-sap/: tema Horizon e 11 cards de trilhas.
2. Buscar "Joule": sobra 1 card.
3. Abrir uma trilha: a URL termina em `#/trilha/<id>`. Dar F5: o detalhe continua.
4. Abrir `https://douglasabnovato.github.io/learning-portal-fiori-sap/#/trilha/999`: aparece "Trilha não encontrada.".
5. DevTools (F12) → Network: nenhuma requisição para `ui5.sap.com` (tudo vem de `/learning-portal-fiori-sap/resources/`).

### Etapa 5 · Fechar

1. No GitHub, **About → Website**: colar `https://douglasabnovato.github.io/learning-portal-fiori-sap/`.
