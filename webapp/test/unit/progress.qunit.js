/* Testes QUnit do progresso salvo: restauração, valores inválidos e armazenamento bloqueado */
sap.ui.define(["com/douglas/learningportal/model/progress"], function (progress) {
    "use strict";

    /* Armazenamento em memória, para não depender do navegador */
    function fakeStorage() {
        var oData = {};
        return {
            getItem: function (k) { return k in oData ? oData[k] : null; },
            setItem: function (k, v) { oData[k] = v; }
        };
    }

    /* Armazenamento bloqueado: toda operação lança erro */
    var oBlocked = {
        getItem: function () { throw new Error("bloqueado"); },
        setItem: function () { throw new Error("bloqueado"); }
    };

    QUnit.module("progress");

    QUnit.test("guarda e restaura o progresso ao abrir", function (assert) {
        var oStorage = fakeStorage();
        assert.strictEqual(progress.save("2", 3, oStorage), true);
        var aRestored = progress.restore([{ Id: "1", ModulosCount: 8, Concluidos: 6 }, { Id: "2", ModulosCount: 6, Concluidos: 0 }], progress.load(oStorage));
        assert.strictEqual(aRestored[0].Concluidos, 6);
        assert.strictEqual(aRestored[1].Concluidos, 3);
    });

    QUnit.test("limita o valor salvo ao total de módulos", function (assert) {
        var aRestored = progress.restore([{ Id: "1", ModulosCount: 4, Concluidos: 1 }, { Id: "2", ModulosCount: 4, Concluidos: 1 }], { 1: 99, 2: "x" });
        assert.strictEqual(aRestored[0].Concluidos, 4);
        assert.strictEqual(aRestored[1].Concluidos, 1);
    });

    QUnit.test("dado corrompido vira progresso vazio", function (assert) {
        var oStorage = fakeStorage();
        oStorage.setItem(progress.KEY, "{quebrado");
        assert.deepEqual(progress.load(oStorage), {});
    });

    QUnit.test("funciona com o armazenamento bloqueado", function (assert) {
        assert.deepEqual(progress.load(oBlocked), {});
        assert.strictEqual(progress.save("1", 2, oBlocked), false);
    });
});
/* Fim de progress.qunit.js */
