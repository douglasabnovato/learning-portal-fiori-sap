/* Executor de testes: sobe o "ui5 serve", roda o QUnit e um teste de fumaça do app (lista, resumo, ordenação, busca, detalhe e 404) no Chromium headless */
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");
const TRILHAS = require("../webapp/model/trilhas.json").Trilhas;

/* Valores esperados do resumo, calculados direto do JSON (módulos somados) */
function geral(aTrilhas) {
  const feitos = aTrilhas.reduce((n, t) => n + t.Concluidos, 0);
  const total = aTrilhas.reduce((n, t) => n + t.ModulosCount, 0);
  return Math.round((feitos / total) * 100);
}
const andamento = TRILHAS.filter((t) => t.Concluidos > 0 && t.Concluidos < t.ModulosCount);
const CONTINUAR = andamento.reduce((m, t) => (t.Concluidos / t.ModulosCount > m.Concluidos / m.ModulosCount ? t : m), andamento[0]);
const PRIMEIRA_AZ = TRILHAS.map((t) => t.Titulo).sort((a, b) => a.localeCompare(b, "pt-BR"))[0];

const PORT = 8099;
const BASE = `http://localhost:${PORT}`;

/* Espera o servidor responder */
async function waitServer(timeoutMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try { if ((await fetch(`${BASE}/index.html`)).ok) return; } catch { /* ainda subindo */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("ui5 serve não respondeu a tempo");
}

/* Roda tudo e devolve o código de saída */
async function main() {
  const server = spawn(process.platform === "win32" ? "npx.cmd" : "npx", ["ui5", "serve", "--port", String(PORT)], { stdio: "ignore", shell: process.platform === "win32" });
  let failures = 0;
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  try {
    await waitServer();
    const context = await browser.newContext({ locale: "pt-BR" });
    const page = await context.newPage();
    await page.goto(`${BASE}/test/unit/unitTests.qunit.html`);
    await page.waitForFunction(() => window.QUnit && document.querySelector("#qunit-testresult .total"), null, { timeout: 60000 });
    const unit = await page.evaluate(() => ({ passed: +document.querySelector("#qunit-testresult .passed").textContent, failed: +document.querySelector("#qunit-testresult .failed").textContent }));
    console.log(`QUnit: ${unit.passed} ok, ${unit.failed} falhas`);
    failures += unit.failed;

    const app = await context.newPage();
    await app.goto(`${BASE}/index.html`);
    await app.waitForSelector(".sapFCard", { timeout: 60000 });
    const checks = [];
    checks.push(["11 cards na lista", (await app.locator(".sapFCard").count()) === 11]);
    /* Resumo da jornada */
    const kpi = async (p, id) => (await p.locator(`[id$="--${id}"]`).first().innerText()).replace(/\s+/g, " ").trim();
    checks.push(["resumo conta 11 trilhas", (await kpi(app, "kpiTotal")).startsWith("11")]);
    checks.push([`progresso geral ${geral(TRILHAS)}%`, (await kpi(app, "kpiGeral")).startsWith(String(geral(TRILHAS)))]);
    checks.push(["continuar sugere a trilha mais adiantada", (await kpi(app, "continueLink")) === CONTINUAR.Titulo]);
    /* Ordenação pelo Select */
    const ordenar = async (texto) => {
      await app.locator('[id$="--sortSelect"]').click();
      await app.locator(".sapMSelectList li", { hasText: texto }).first().click();
      await app.waitForTimeout(500);
    };
    const primeiroCard = async () => app.locator(".sapFCard button").first().getAttribute("title");
    await ordenar("Maior progresso");
    checks.push(["ordenar por progresso põe 100% primeiro", (await app.locator(".sapFCard .sapMPI").first().innerText()).includes("100%")]);
    await ordenar("Título (A a Z)");
    checks.push([`ordenar por título começa em "${PRIMEIRA_AZ}"`, (await primeiroCard()) === PRIMEIRA_AZ]);
    await ordenar("Ordem do catálogo");
    checks.push(["ordem do catálogo restaurada", (await primeiroCard()) === TRILHAS[0].Titulo]);
    await app.locator("input[type=search]").fill("Joule");
    await app.waitForTimeout(500);
    checks.push(["busca filtra", (await app.locator(".sapFCard").count()) === 1]);
    await app.locator(".sapFCard button").first().click();
    await app.waitForURL(/#\/trilha\/4$/);
    /* Procura o título dentro da página de detalhe: o card da lista segue no DOM, oculto */
    const tituloDetalhe = app.locator('[id$="--detailPage"]').getByText("AI Assistant - Joule & GenAI").first();
    await tituloDetalhe.waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
    checks.push(["detalhe pelo Id", await tituloDetalhe.isVisible()]);
    await app.locator("button", { hasText: "Concluir módulo" }).click();
    await app.reload();
    await app.locator("button", { hasText: "Concluir módulo" }).waitFor({ timeout: 60000 });
    await app.waitForTimeout(500);
    checks.push(["progresso restaurado ao recarregar", (await app.locator(".sapMPI:visible").first().innerText()).includes("50%")]);
    /* De volta à lista, o resumo inclui o módulo concluído */
    const depois = TRILHAS.map((t) => (t.Id === "4" ? { ...t, Concluidos: t.Concluidos + 1 } : t));
    await app.goto(`${BASE}/index.html#/`);
    await app.waitForTimeout(800);
    checks.push([`resumo atualizado para ${geral(depois)}%`, (await kpi(app, "kpiGeral")).startsWith(String(geral(depois)))]);
    await app.locator('[id$="--continueLink"]').click();
    await app.waitForURL(new RegExp(`#/trilha/${CONTINUAR.Id}$`), { timeout: 10000 }).catch(() => {});
    checks.push(["continuar abre a trilha sugerida", new RegExp(`#/trilha/${CONTINUAR.Id}$`).test(app.url())]);
    await app.goto(`${BASE}/index.html#/trilha/999`);
    await app.waitForTimeout(800);
    checks.push(["id inexistente mostra aviso", await app.getByText("Trilha não encontrada.").isVisible()]);
    /* Teclado: o primeiro botão de card abre o detalhe só com Tab e Enter */
    const kb = await context.newPage();
    await kb.goto(`${BASE}/index.html`);
    await kb.waitForSelector(".sapFCard", { timeout: 60000 });
    let abriu = false;
    for (let i = 0; i < 25 && !abriu; i += 1) {
      await kb.keyboard.press("Tab");
      abriu = await kb.evaluate(() => document.activeElement?.closest(".sapFCard") !== null && document.activeElement?.tagName === "BUTTON");
    }
    if (abriu) { await kb.keyboard.press("Enter"); await kb.waitForTimeout(800); }
    checks.push(["detalhe aberto pelo teclado", abriu && /#\/trilha\//.test(kb.url())]);
    /* Falha de rede nas trilhas mostra o aviso */
    const off = await context.newPage();
    await off.route("**/model/trilhas.json", (r) => r.abort());
    await off.goto(`${BASE}/index.html`);
    await off.getByText("Não foi possível carregar as trilhas").waitFor({ timeout: 60000 }).catch(() => {});
    checks.push(["falha ao carregar mostra aviso", await off.getByText("Não foi possível carregar as trilhas").isVisible()]);
    for (const [name, ok] of checks) { console.log(`${ok ? "ok  " : "FALHA"} ${name}`); if (!ok) failures += 1; }
  } finally {
    await browser.close();
    server.kill();
  }
  return failures ? 1 : 0;
}

main().then((code) => process.exit(code)).catch((err) => { console.error(err); process.exit(1); });
/* Fim de run-qunit.cjs */
