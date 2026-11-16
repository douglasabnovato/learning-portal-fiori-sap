/* Executor de testes: sobe o "ui5 serve", roda o QUnit e um teste de fumaça do app (lista, resumo, ordenação, busca, detalhe e 404) no Chromium headless */
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
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
  /* portal.test aponta para o servidor local e faz o papel do site publicado no teste da medição */
  const browser = await chromium.launch({ args: ["--host-resolver-rules=MAP portal.test 127.0.0.1"], ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  try {
    await waitServer();
    const context = await browser.newContext({ locale: "pt-BR" });
    context.setDefaultNavigationTimeout(60000); /* o UI5 sem build pede centenas de módulos; com a máquina ocupada, 30 s não bastam */
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
    /* Busca sem resultado mostra o estado vazio (antes ele nunca aparecia) */
    await app.locator("input[type=search]").fill("trilha-que-nao-existe");
    await app.waitForTimeout(500);
    checks.push(["busca vazia mostra o estado vazio", (await app.locator(".sapFCard").count()) === 0 && await app.getByText("Nenhuma trilha encontrada.").first().isVisible()]);
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
    /* Favoritos (#18): marcar, recarregar, filtrar e o estado vazio */
    const fav = await context.newPage();
    await fav.goto(`${BASE}/index.html`);
    await fav.waitForSelector(".sapFCard", { timeout: 60000 });
    const estrela = (p) => p.locator(".sapFCard").first().locator("button[aria-pressed]");
    checks.push([`favorito com nome acessível "Favoritar: ${TRILHAS[0].Titulo}"`, (await estrela(fav).getAttribute("title")) === `Favoritar: ${TRILHAS[0].Titulo}` && (await estrela(fav).getAttribute("aria-pressed")) === "false"]);
    await estrela(fav).click();
    await fav.reload();
    await fav.waitForSelector(".sapFCard", { timeout: 60000 });
    await fav.waitForTimeout(500);
    checks.push(["favorito restaurado ao recarregar", (await estrela(fav).getAttribute("aria-pressed")) === "true"]);
    await fav.locator('[id$="--favoriteOnly"]').click();
    await fav.waitForTimeout(500);
    checks.push(["só favoritas mostra 1 card", (await fav.locator(".sapFCard").count()) === 1 && (await fav.locator(".sapFCard button").first().getAttribute("title")) === TRILHAS[0].Titulo]);
    await estrela(fav).click();
    await fav.waitForTimeout(500);
    checks.push(["sem favoritas mostra o estado vazio", (await fav.locator(".sapFCard").count()) === 0 && await fav.getByText("Nenhuma trilha favorita.").first().isVisible()]);
    /* Acessibilidade: axe (WCAG 2.1 A e AA) em largura de desktop, com as 11 trilhas reais.
       O app só tem o tema sap_horizon (claro); não há tema escuro próprio para testar. */
    const a11y = await browser.newContext({ locale: "pt-BR", viewport: { width: 1280, height: 800 } });
    a11y.setDefaultNavigationTimeout(60000);
    const axe = async (p) => (await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()).violations;
    const semViolacoes = (nome, v) => {
      if (v.length) console.log(`  axe em ${nome}: ${v.map((x) => `${x.id} (${x.nodes.length})`).join(", ")}`);
      return v.length === 0;
    };
    const ax = await a11y.newPage();
    await ax.goto(`${BASE}/index.html`);
    await ax.waitForSelector(".sapFCard", { timeout: 60000 });
    await ax.waitForTimeout(500);
    checks.push(["axe sem violações na lista (11 trilhas, 1280 px)", (await ax.locator(".sapFCard").count()) === 11 && semViolacoes("lista", await axe(ax))]);
    await ax.goto(`${BASE}/index.html#/trilha/4`);
    await ax.locator("button", { hasText: "Concluir módulo" }).waitFor({ timeout: 60000 });
    await ax.waitForTimeout(500);
    checks.push(["axe sem violações no detalhe", semViolacoes("detalhe", await axe(ax))]);
    await ax.goto(`${BASE}/index.html#/trilha/999`);
    await ax.getByText("Trilha não encontrada.").waitFor({ timeout: 60000 });
    await ax.waitForTimeout(500);
    checks.push(["axe sem violações na trilha inexistente", semViolacoes("trilha inexistente", await axe(ax))]);
    /* Foco visível: no tema Horizon, o UI5 desenha o foco no ::before do .sapMFocusable (borda de 2 px).
       Confere esse desenho com foco e sem foco, e que os pixels do botão mudam */
    const fo = await a11y.newPage();
    await fo.goto(`${BASE}/index.html`);
    await fo.waitForSelector(".sapFCard", { timeout: 60000 });
    let focado = false;
    for (let i = 0; i < 25 && !focado; i += 1) {
      await fo.keyboard.press("Tab");
      focado = await fo.evaluate(() => document.activeElement?.closest(".sapFCard") !== null && document.activeElement?.tagName === "BUTTON");
    }
    let focoVisivel = false;
    if (focado) {
      const anel = () => fo.evaluate(() => {
        const s = getComputedStyle(window.__botao.querySelector(".sapMFocusable"), "::before");
        return { desenhado: s.content !== "none" && parseFloat(s.borderTopWidth) >= 1 && s.borderTopStyle !== "none" };
      });
      const caixa = await fo.evaluate(() => { window.__botao = document.activeElement; const r = window.__botao.getBoundingClientRect(); return { x: r.x - 4, y: r.y - 4, width: r.width + 8, height: r.height + 8 }; });
      await fo.waitForTimeout(300);
      const comFoco = await fo.screenshot({ clip: caixa });
      const anelComFoco = await anel();
      await fo.evaluate(() => document.activeElement.blur());
      await fo.waitForTimeout(300);
      const semFoco = await fo.screenshot({ clip: caixa });
      const anelSemFoco = await anel();
      focoVisivel = anelComFoco.desenhado && !anelSemFoco.desenhado && !comFoco.equals(semFoco);
    }
    checks.push(["foco visível no botão do card (Tab)", focoVisivel]);
    /* Esc: a lista de ordenação abre pelo teclado e fecha com Esc, com o foco de volta no Select */
    let noSelect = false;
    for (let i = 0; i < 25 && !noSelect; i += 1) {
      await fo.keyboard.press("Tab");
      noSelect = await fo.evaluate(() => !!document.activeElement?.closest('[id$="--sortSelect"]'));
    }
    let escOk = false;
    if (noSelect) {
      await fo.keyboard.press("Alt+ArrowDown");
      const lista = fo.locator(".sapMSelectList:visible");
      const abriu = await lista.first().waitFor({ timeout: 5000 }).then(() => true, () => false);
      await fo.keyboard.press("Escape");
      await fo.waitForTimeout(500);
      escOk = abriu && (await lista.count()) === 0 && await fo.evaluate(() => !!document.activeElement?.closest('[id$="--sortSelect"]'));
    }
    checks.push(["ordenação abre pelo teclado e fecha com Esc", escOk]);
    await a11y.close();
    /* Medição (D5): nada do GoatCounter em localhost; no "site publicado", o script carrega e o detalhe conta o evento */
    const pedidosGc = [];
    context.on("request", (r) => { if (r.url().startsWith("https://gc.zgo.at/")) pedidosGc.push(r.url()); });
    const local = await context.newPage();
    await local.goto(`${BASE}/index.html#/trilha/4`);
    await local.locator("button", { hasText: "Concluir módulo" }).waitFor({ timeout: 60000 });
    checks.push(["medição não carrega em localhost", (await local.locator("script[data-goatcounter]").count()) === 0 && pedidosGc.length === 0]);
    const pub = await context.newPage();
    await pub.route("https://gc.zgo.at/count.js", (r) => r.fulfill({ contentType: "text/javascript", body: "window.goatcounter = { count: function (o) { (window.__eventos = window.__eventos || []).push(o); } };" }));
    await pub.goto(`http://portal.test:${PORT}/index.html`, { waitUntil: "domcontentloaded", timeout: 60000 }); /* a carga completa pode passar de 30 s com a máquina ocupada */
    await pub.waitForSelector(".sapFCard", { timeout: 60000 });
    const endereco = await pub.locator("script[data-goatcounter]").getAttribute("data-goatcounter");
    checks.push(["medição carrega no site com o código do portfólio", endereco === "https://douglasabnovato.goatcounter.com/count"]);
    await pub.waitForFunction(() => window.goatcounter && window.goatcounter.count, null, { timeout: 10000 }).catch(() => {});
    await pub.goto(`http://portal.test:${PORT}/index.html#/trilha/4`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await pub.waitForFunction(() => (window.__eventos || []).some((e) => e.path === "abrir-trilha" && e.event === true), null, { timeout: 10000 }).catch(() => {});
    checks.push(["abrir a trilha conta o evento abrir-trilha", await pub.evaluate(() => (window.__eventos || []).some((e) => e.path === "abrir-trilha" && e.event === true))]);
    for (const [name, ok] of checks) { console.log(`${ok ? "ok  " : "FALHA"} ${name}`); if (!ok) failures += 1; }
  } finally {
    await browser.close();
    server.kill();
  }
  return failures ? 1 : 0;
}

main().then((code) => process.exit(code)).catch((err) => { console.error(err); process.exit(1); });
/* Fim de run-qunit.cjs */
