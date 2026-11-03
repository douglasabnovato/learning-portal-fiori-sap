/* Resumo da jornada e ordenação do catálogo: funções puras, calculadas a partir dos módulos */
sap.ui.define(["./formatter"], function (formatter) {
    "use strict";

    /* Totais da jornada: contagem por status, progresso geral pelos módulos, horas feitas e a trilha para continuar */
    function resumo(aTrilhas) {
        var oResumo = { total: 0, emAndamento: 0, concluidas: 0, naoIniciadas: 0, progressoGeral: 0, horasFeitas: 0, horasTotal: 0, continuar: null };
        var iFeitos = 0;
        var iModulos = 0;
        var nHorasFeitas = 0;
        var iMelhor = -1;
        (aTrilhas || []).forEach(function (oTrilha) {
            var iTotal = Math.max(Number(oTrilha.ModulosCount) || 0, 0);
            var iConcluidos = Math.min(Math.max(Number(oTrilha.Concluidos) || 0, 0), iTotal);
            var iHoras = Math.max(Number(oTrilha.Horas) || 0, 0);
            var iProgresso = formatter.progresso(iConcluidos, iTotal);
            var sStatus = formatter.status(iConcluidos, iTotal);
            oResumo.total += 1;
            if (sStatus === "Concluído") { oResumo.concluidas += 1; }
            else if (sStatus === "Em Andamento") { oResumo.emAndamento += 1; }
            else { oResumo.naoIniciadas += 1; }
            iFeitos += iConcluidos;
            iModulos += iTotal;
            oResumo.horasTotal += iHoras;
            nHorasFeitas += iTotal ? iHoras * iConcluidos / iTotal : 0;
            /* Continuar: a trilha em andamento mais adiantada; empate fica com a primeira do catálogo */
            if (sStatus === "Em Andamento" && iProgresso > iMelhor) {
                iMelhor = iProgresso;
                oResumo.continuar = { Id: oTrilha.Id, Titulo: oTrilha.Titulo, progresso: iProgresso };
            }
        });
        oResumo.progressoGeral = formatter.progresso(iFeitos, iModulos);
        oResumo.horasFeitas = Math.round(nHorasFeitas);
        return oResumo;
    }

    /* Chaves de ordenação aceitas pelo catálogo */
    var ORDENS = {
        /* Ordem do catálogo pelo Id; o binding do UI5 não volta à ordem original com uma lista de sorters vazia */
        catalogo: function (a, b) { return String(a.Id).localeCompare(String(b.Id), "pt-BR", { numeric: true }); },
        titulo: function (a, b) { return String(a.Titulo).localeCompare(String(b.Titulo), "pt-BR"); },
        progresso: function (a, b) { return formatter.progresso(b.Concluidos, b.ModulosCount) - formatter.progresso(a.Concluidos, a.ModulosCount); },
        horas: function (a, b) { return (Number(a.Horas) || 0) - (Number(b.Horas) || 0); }
    };

    /* Comparador de duas trilhas pela chave; chave desconhecida devolve null */
    function comparador(sChave) {
        return ORDENS[sChave] || null;
    }

    return { resumo: resumo, comparador: comparador };
});
/* Fim de resumo.js */
