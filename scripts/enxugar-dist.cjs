/* Enxuga o dist/ depois do "ui5 build self-contained --all" (#30): tira o que o site publicado não usa.
   Mantém todas as bibliotecas, os textos de todos os idiomas e o CLDR, porque o UI5 os pede conforme o idioma do navegador.
   Tira: mapas de código, fontes de depuração (-dbg), fontes .less dos temas, temas que o app não usa e o código de teste. */
const fs = require("node:fs");
const path = require("node:path");

const DIST = path.join(__dirname, "..", "dist");
/* O index.html fixa o sap_horizon; o "base" é a base dele */
const TEMAS_FORA = new Set(["sap_hcb", "sap_horizon_dark", "sap_horizon_hcb", "sap_horizon_hcw"]);
/* Pastas de teste: o site não roda QUnit nem OPA */
const PASTAS_FORA = ["test", "test-resources", "resources/sap/ui/test", "resources/sap/ui/qunit"].map((p) => path.join(DIST, p));
const ARQUIVO_FORA = /(\.map|-dbg\.js|-dbg\.[^/\\]+\.js|\.less)$/;

function tamanho(dir) {
  let bytes = 0;
  let arquivos = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { const t = tamanho(p); bytes += t.bytes; arquivos += t.arquivos; } else { bytes += fs.statSync(p).size; arquivos += 1; }
  }
  return { bytes, arquivos };
}

function enxugar(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      const dentroDeTemas = path.basename(dir) === "themes";
      if ((dentroDeTemas && TEMAS_FORA.has(e.name)) || PASTAS_FORA.includes(p)) { fs.rmSync(p, { recursive: true, force: true }); continue; }
      enxugar(p);
    } else if (ARQUIVO_FORA.test(e.name)) {
      fs.rmSync(p);
    }
  }
}

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error("dist/index.html não existe: rode o ui5 build antes");
  process.exit(1);
}
const mb = (b) => (b / 1024 / 1024).toFixed(1);
const antes = tamanho(DIST);
enxugar(DIST);
const depois = tamanho(DIST);
console.log(`dist enxuto: ${mb(antes.bytes)} MB e ${antes.arquivos} arquivos -> ${mb(depois.bytes)} MB e ${depois.arquivos} arquivos`);
/* Fim de enxugar-dist.cjs */
