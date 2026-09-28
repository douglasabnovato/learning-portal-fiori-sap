/* Executor de testes: sobe o "ui5 serve", roda o QUnit e um teste de fumaça do app (lista, busca, detalhe e 404) no Chromium headless */
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

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
    await app.locator("input[type=search]").fill("Joule");
    await app.waitForTimeout(500);
    checks.push(["busca filtra", (await app.locator(".sapFCard").count()) === 1]);
    await app.locator(".sapFCard button").first().click();
    await app.waitForURL(/#\/trilha\/4$/);
    checks.push(["detalhe pelo Id", await app.getByText("AI Assistant - Joule & GenAI").first().isVisible()]);
    await app.goto(`${BASE}/index.html#/trilha/999`);
    await app.waitForTimeout(800);
    checks.push(["id inexistente mostra aviso", await app.getByText("Trilha não encontrada.").isVisible()]);
    for (const [name, ok] of checks) { console.log(`${ok ? "ok  " : "FALHA"} ${name}`); if (!ok) failures += 1; }
  } finally {
    await browser.close();
    server.kill();
  }
  return failures ? 1 : 0;
}

main().then((code) => process.exit(code)).catch((err) => { console.error(err); process.exit(1); });
/* Fim de run-qunit.cjs */
