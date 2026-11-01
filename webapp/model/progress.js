/* Progresso das trilhas no navegador: guarda só os módulos concluídos por Id e funciona sem armazenamento */
sap.ui.define([], function () {
    "use strict";

    var KEY = "learning-portal.progresso.v1";

    /* Acesso ao armazenamento; alguns navegadores lançam erro só de ler a propriedade */
    function storageOf(oStorage) {
        if (oStorage) {
            return oStorage;
        }
        try {
            return window.localStorage;
        } catch (e) {
            return null;
        }
    }

    /* Lê o progresso salvo; dado ausente, corrompido ou bloqueado vira objeto vazio */
    function load(oStorage) {
        try {
            var oSaved = JSON.parse(storageOf(oStorage).getItem(KEY));
            return oSaved && typeof oSaved === "object" && !Array.isArray(oSaved) ? oSaved : {};
        } catch (e) {
            return {};
        }
    }

    /* Grava o progresso de uma trilha; devolve false se o armazenamento recusar */
    function save(sId, iConcluidos, oStorage) {
        try {
            var oSaved = load(oStorage);
            oSaved[sId] = iConcluidos;
            storageOf(oStorage).setItem(KEY, JSON.stringify(oSaved));
            return true;
        } catch (e) {
            return false;
        }
    }

    /* Mantém o valor entre 0 e o total de módulos */
    function clamp(iConcluidos, iTotal) {
        return Math.max(0, Math.min(Math.round(Number(iConcluidos)) || 0, iTotal));
    }

    /* Devolve as trilhas com o progresso salvo; valor inválido mantém o original */
    function restore(aTrilhas, oSaved) {
        return aTrilhas.map(function (oTrilha) {
            var vSaved = oSaved[oTrilha.Id];
            if (typeof vSaved !== "number") {
                return oTrilha;
            }
            return Object.assign({}, oTrilha, { Concluidos: clamp(vSaved, oTrilha.ModulosCount) });
        });
    }

    return { KEY: KEY, load: load, save: save, clamp: clamp, restore: restore };
});
/* Fim de progress.js */
