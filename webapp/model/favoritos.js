/* Favoritos no navegador: guarda só a lista de Ids marcados e funciona sem armazenamento (#18) */
sap.ui.define([], function () {
    "use strict";

    var KEY = "learning-portal.favoritos.v1";

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

    /* Lê os Ids salvos; dado ausente, corrompido ou bloqueado vira lista vazia */
    function load(oStorage) {
        try {
            var aSaved = JSON.parse(storageOf(oStorage).getItem(KEY));
            if (!Array.isArray(aSaved)) {
                return [];
            }
            return aSaved.filter(function (v, i) {
                return typeof v === "string" && aSaved.indexOf(v) === i;
            });
        } catch (e) {
            return [];
        }
    }

    /* Grava a lista de Ids; devolve false se o armazenamento recusar */
    function save(aIds, oStorage) {
        try {
            storageOf(oStorage).setItem(KEY, JSON.stringify(aIds));
            return true;
        } catch (e) {
            return false;
        }
    }

    /* Liga ou desliga um Id, sem repetir e sem mudar a lista recebida */
    function toggle(aIds, sId, bFavorita) {
        var aSem = aIds.filter(function (v) { return v !== String(sId); });
        return bFavorita ? aSem.concat(String(sId)) : aSem;
    }

    /* Devolve as trilhas com o campo Favorita preenchido */
    function apply(aTrilhas, aIds) {
        return aTrilhas.map(function (oTrilha) {
            return Object.assign({}, oTrilha, { Favorita: aIds.indexOf(String(oTrilha.Id)) >= 0 });
        });
    }

    /* Ids das trilhas marcadas, na ordem do catálogo */
    function ids(aTrilhas) {
        return aTrilhas.filter(function (t) { return t.Favorita === true; }).map(function (t) { return String(t.Id); });
    }

    return { KEY: KEY, load: load, save: save, toggle: toggle, apply: apply, ids: ids };
});
/* Fim de favoritos.js */
