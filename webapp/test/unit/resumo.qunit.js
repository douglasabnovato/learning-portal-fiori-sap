/* Testes QUnit do resumo da jornada e da ordenação do catálogo */
sap.ui.define(["com/douglas/learningportal/model/resumo"], function (resumo) {
    "use strict";

    var aTrilhas = [
        { Id: "1", Titulo: "Fiori", ModulosCount: 4, Concluidos: 3, Horas: 40 },
        { Id: "2", Titulo: "ABAP", ModulosCount: 4, Concluidos: 0, Horas: 10 },
        { Id: "3", Titulo: "BTP", ModulosCount: 2, Concluidos: 2, Horas: 20 },
        { Id: "4", Titulo: "Joule", ModulosCount: 4, Concluidos: 1, Horas: 30 }
    ];

    QUnit.module("resumo");

    QUnit.test("conta as trilhas por status", function (assert) {
        var o = resumo.resumo(aTrilhas);
        assert.strictEqual(o.total, 4);
        assert.strictEqual(o.concluidas, 1);
        assert.strictEqual(o.emAndamento, 2);
        assert.strictEqual(o.naoIniciadas, 1);
    });

    QUnit.test("progresso geral pesa os módulos, não a média das trilhas", function (assert) {
        var o = resumo.resumo(aTrilhas);
        assert.strictEqual(o.progressoGeral, 43, "6 de 14 módulos");
        assert.strictEqual(o.horasFeitas, 58, "30 + 0 + 20 + 7,5");
        assert.strictEqual(o.horasTotal, 100);
    });

    QUnit.test("sugere continuar a trilha em andamento mais adiantada", function (assert) {
        assert.strictEqual(resumo.resumo(aTrilhas).continuar.Id, "1");
        assert.strictEqual(resumo.resumo([aTrilhas[1], aTrilhas[2]]).continuar, null, "sem trilha em andamento, não sugere");
    });

    QUnit.test("lista vazia ou dado inválido não quebra", function (assert) {
        var o = resumo.resumo(undefined);
        assert.strictEqual(o.total, 0);
        assert.strictEqual(o.progressoGeral, 0);
        o = resumo.resumo([{ Id: "x", ModulosCount: "a", Concluidos: null, Horas: -5 }]);
        assert.strictEqual(o.naoIniciadas, 1);
        assert.strictEqual(o.horasTotal, 0);
    });

    QUnit.test("ordena por título, progresso e carga horária", function (assert) {
        function ids(sChave) { return aTrilhas.slice().sort(resumo.comparador(sChave)).map(function (t) { return t.Id; }).join(","); }
        assert.strictEqual(ids("titulo"), "2,3,1,4");
        assert.strictEqual(ids("progresso"), "3,1,4,2");
        assert.strictEqual(ids("horas"), "2,3,4,1");
        assert.strictEqual(ids("catalogo"), "1,2,3,4", "volta à ordem do catálogo pelo Id");
        assert.strictEqual(resumo.comparador("outra"), null);
    });
});
/* Fim de resumo.qunit.js */
