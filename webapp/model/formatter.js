/* Formatadores puros: progresso e status calculados a partir dos módulos (uma fonte de verdade) */
sap.ui.define([], function () {
    "use strict";

    /* Percentual concluído (0 a 100) a partir de módulos concluídos / total */
    function progresso(iConcluidos, iTotal) {
        var nTotal = Number(iTotal) || 0;
        if (nTotal <= 0) { return 0; }
        var nFeitos = Math.min(Math.max(Number(iConcluidos) || 0, 0), nTotal);
        return Math.round((nFeitos / nTotal) * 100);
    }

    /* Status textual derivado do progresso */
    function status(iConcluidos, iTotal) {
        var p = progresso(iConcluidos, iTotal);
        if (p >= 100) { return "Concluído"; }
        return p > 0 ? "Em Andamento" : "Não Iniciado";
    }

    /* Estado visual do indicador de progresso */
    function estado(iConcluidos, iTotal) {
        var p = progresso(iConcluidos, iTotal);
        if (p >= 100) { return "Success"; }
        return p > 0 ? "Information" : "None";
    }

    /* Texto "75%" para o indicador */
    function percentual(iConcluidos, iTotal) {
        return progresso(iConcluidos, iTotal) + "%";
    }

    return { progresso: progresso, status: status, estado: estado, percentual: percentual };
});
/* Fim de formatter.js */
