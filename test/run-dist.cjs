/* Teste do build publicado: serve o dist/ no subcaminho do Pages (/learning-portal-fiori-sap/), com gzip,
   e confere no Chromium a lista, a busca, o detalhe e a trilha inexistente, sem requisição com erro nem saída para ui5.sap.com (#30). Com SITE_URL, faz o mesmo no site publicado */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const { chromium } = require("playwright");

const DIST = path.join(__dirname, "..", "dist");
const PREFIXO = "/learning-portal-fiori-sap/";
const PORT = Number(process.env.DIST_PORT) || 8098;
/* SITE_URL testa o site publicado em vez do dist/ local (ex.: https://douglasabnovato.github.io/learning-portal-fiori-sap/) */
const SITE = process.env.SITE_URL;
const ONDE = SITE ? "site" : "dist";
const BASE = SITE || `http://localhost:${PORT}${PREFIXO}`;
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".css": "text/css", ".properties": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".png": "image/png", ".xml": "application/xml" };

/* Servidor estático mínimo, como o Pages: só o subcaminho, gzip quando o navegador aceita */
function servir() {
  return http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (!url.startsWith(PREFIXO)) { res.writeHead(404); res.end(); return; }
    let arquivo = path.join(DIST, url.slice(PREFIXO.length));
    if (!arquivo.startsWith(DIST)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(arquivo) && fs.statSync(arquivo).isDirectory()) arquivo = path.join(arquivo, "index.html");
    if (!fs.existsSync(arquivo)) { res.writeHead(404); res.end(); return; }
    const tipo = TIPOS[path.extname(arquivo)] || "application/octet-stream";
    const corpo = fs.readFileSync(arquivo);
    if (/gzip/.test(req.headers["accept-encoding"] || "") && !/font|image\/png/.test(tipo)) {
      res.writeHead(200, { "Content-Type": tipo, "Content-Encoding": "gzip" });
      res.end(zlib.gzipSync(corpo));
    } else {
      res.writeHead(200, { "Content-Type": tipo });
      res.end(corpo);
    }
  }).listen(PORT);
}

/* Espera uma condição: devolve true assim que ela vale, ou false no fim do prazo */
async function ate(condicao, timeoutMs = 15000) {
  const inicio = Date.now();
  while (Date.now() - inicio < timeoutMs) {
    try { if (await condicao()) return true; } catch { /* elemento ainda não existe */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
}

async function main() {
  if (!SITE && !fs.existsSync(path.join(DIST, "index.html"))) { console.error("dist/index.html não existe: rode npm run build antes"); return 1; }
  const server = SITE ? null : servir();
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const erros = [];
  const externos = [];
  const checks = [];
  try {
    const context = await browser.newContext({ locale: "pt-BR" });
    context.setDefaultNavigationTimeout(60000);
    context.on("response", (r) => { if (r.status() >= 400) erros.push(`${r.status()} ${r.url()}`); });
    /* ERR_ABORTED é o navegador largando um pedido ao trocar de página, não arquivo faltando (esse vem como 404 acima) */
    context.on("requestfailed", (r) => { if (!r.url().startsWith("https://gc.zgo.at/") && r.failure()?.errorText !== "net::ERR_ABORTED") erros.push(`falhou (${r.failure()?.errorText}) ${r.url()}`); });
    context.on("request", (r) => { if (/ui5\.sap\.com|sapui5\.hana\.ondemand\.com|openui5\.hana\.ondemand\.com/.test(r.url())) externos.push(r.url()); });
    /* A medição só carrega fora de localhost; aqui o host é localhost, então nada sai para o GoatCounter */
    /* No site publicado a medição carregaria: corta o GoatCounter para o teste não contar visita */
    await context.route("https://gc.zgo.at/**", (r) => r.abort());
    const page = await context.newPage();
    await page.goto(BASE);
    await page.waitForSelector(".sapFCard", { timeout: 60000 });
    checks.push([`${ONDE}: 11 cards na lista`, await ate(async () => (await page.locator(".sapFCard").count()) === 11)]);
    await page.locator("input[type=search]").fill("Joule");
    checks.push([`${ONDE}: busca filtra`, await ate(async () => (await page.locator(".sapFCard").count()) === 1)]);
    await page.locator(".sapFCard button").first().click();
    checks.push([`${ONDE}: detalhe pelo Id`, await ate(async () => /#\/trilha\/4$/.test(page.url()) && await page.locator('[id$="--detailPage"]').getByText("AI Assistant - Joule & GenAI").first().isVisible())]);
    await page.reload();
    checks.push([`${ONDE}: detalhe continua depois do F5`, await ate(() => page.locator("button", { hasText: "Concluir módulo" }).isVisible(), 60000)]);
    await page.goto(`${BASE}#/trilha/999`);
    checks.push([`${ONDE}: trilha inexistente mostra aviso`, await ate(() => page.getByText("Trilha não encontrada.").isVisible())]);
    /* Ícones e ilustrações vêm de arquivos carregados sob demanda: abrir o estado vazio da busca carrega a ilustração */
    await page.goto(BASE);
    await page.waitForSelector(".sapFCard", { timeout: 60000 });
    await page.locator("input[type=search]").fill("trilha-que-nao-existe");
    checks.push([`${ONDE}: estado vazio da busca`, await ate(() => page.getByText("Nenhuma trilha encontrada.").first().isVisible())]);
    await page.waitForLoadState("networkidle");
    checks.push([`${ONDE}: nenhuma requisição com erro`, erros.length === 0]);
    checks.push([`${ONDE}: nada vem de ui5.sap.com`, externos.length === 0]);
  } finally {
    await browser.close();
    if (server) server.close();
  }
  for (const e of erros.slice(0, 20)) console.log(`  erro: ${e}`);
  for (const e of externos.slice(0, 5)) console.log(`  externo: ${e}`);
  let falhas = 0;
  for (const [nome, ok] of checks) { console.log(`${ok ? "ok  " : "FALHA"} ${nome}`); if (!ok) falhas += 1; }
  return falhas ? 1 : 0;
}

main().then((code) => process.exit(code)).catch((err) => { console.error(err); process.exit(1); });
/* Fim de run-dist.cjs */
