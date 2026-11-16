/* Testes QUnit dos favoritos: marcar, restaurar, dado inválido e armazenamento bloqueado */
sap.ui.define(["com/douglas/learningportal/model/favoritos"], function (favoritos) {
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

    var TRILHAS = [{ Id: "1", Titulo: "A" }, { Id: "2", Titulo: "B" }, { Id: "3", Titulo: "C" }];

    QUnit.module("favoritos");

    QUnit.test("marca, salva e restaura ao abrir", function (assert) {
        var oStorage = fakeStorage();
        var aIds = favoritos.toggle(favoritos.toggle([], "3", true), "1", true);
        assert.strictEqual(favoritos.save(aIds, oStorage), true);
        var aTrilhas = favoritos.apply(TRILHAS, favoritos.load(oStorage));
        assert.deepEqual(aTrilhas.map(function (t) { return t.Favorita; }), [true, false, true]);
        assert.deepEqual(favoritos.ids(aTrilhas), ["1", "3"]);
    });

    QUnit.test("desmarcar tira o Id, e marcar duas vezes não repete", function (assert) {
        var aIds = favoritos.toggle(favoritos.toggle(["2"], "2", true), "2", true);
        assert.deepEqual(aIds, ["2"]);
        assert.deepEqual(favoritos.toggle(aIds, "2", false), []);
        assert.deepEqual(aIds, ["2"], "a lista recebida não muda");
    });

    QUnit.test("dado corrompido ou de outro tipo vira lista vazia", function (assert) {
        var oStorage = fakeStorage();
        oStorage.setItem(favoritos.KEY, "{quebrado");
        assert.deepEqual(favoritos.load(oStorage), []);
        oStorage.setItem(favoritos.KEY, JSON.stringify({ 1: true }));
        assert.deepEqual(favoritos.load(oStorage), []);
        oStorage.setItem(favoritos.KEY, JSON.stringify(["1", 2, "1", null]));
        assert.deepEqual(favoritos.load(oStorage), ["1"]);
    });

    QUnit.test("funciona com o armazenamento bloqueado", function (assert) {
        assert.deepEqual(favoritos.load(oBlocked), []);
        assert.strictEqual(favoritos.save(["1"], oBlocked), false);
        assert.deepEqual(favoritos.apply(TRILHAS, favoritos.load(oBlocked)).map(function (t) { return t.Favorita; }), [false, false, false]);
    });
});
/* Fim de favoritos.qunit.js */
