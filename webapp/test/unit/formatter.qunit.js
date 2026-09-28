/* Testes QUnit do formatter: progresso, status e estado derivados dos módulos */
sap.ui.define(["com/douglas/learningportal/model/formatter"], function (formatter) {
    "use strict";

    QUnit.module("formatter");

    QUnit.test("progresso arredonda e limita entre 0 e 100", function (assert) {
        assert.strictEqual(formatter.progresso(1, 4), 25);
        assert.strictEqual(formatter.progresso(2, 6), 33);
        assert.strictEqual(formatter.progresso(9, 5), 100);
        assert.strictEqual(formatter.progresso(-1, 5), 0);
        assert.strictEqual(formatter.progresso(3, 0), 0);
    });

    QUnit.test("status e estado seguem o progresso", function (assert) {
        assert.strictEqual(formatter.status(0, 5), "Não Iniciado");
        assert.strictEqual(formatter.status(2, 5), "Em Andamento");
        assert.strictEqual(formatter.status(5, 5), "Concluído");
        assert.strictEqual(formatter.estado(5, 5), "Success");
        assert.strictEqual(formatter.estado(1, 5), "Information");
        assert.strictEqual(formatter.percentual(3, 4), "75%");
    });
});
/* Fim de formatter.qunit.js */
