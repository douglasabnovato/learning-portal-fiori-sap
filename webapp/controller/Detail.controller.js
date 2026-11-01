/* Detalhe da trilha: localiza pelo Id (antes usava a posição no array) e trata Id inexistente */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "../model/progress"
], function (Controller, UIComponent, History, formatter, progress) {
    "use strict";

    return Controller.extend("com.douglas.learningportal.controller.Detail", {

        formatter: formatter,

        /* Escuta a rota de detalhe */
        onInit: function () {
            UIComponent.getRouterFor(this).getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
        },

        /* Vincula a visão à trilha com o Id da URL, depois que os dados carregam */
        _onObjectMatched: function (oEvent) {
            var sId = oEvent.getParameter("arguments").trilhaId;
            var oModel = this.getOwnerComponent().getModel();
            oModel.dataLoaded().then(function () {
                var aTrilhas = oModel.getProperty("/Trilhas") || [];
                var iIndex = aTrilhas.findIndex(function (t) { return String(t.Id) === String(sId); });
                var bFound = iIndex >= 0;
                this.byId("notFound").setVisible(!bFound);
                this.byId("detailContent").setVisible(bFound);
                if (bFound) {
                    this.getView().bindElement({ path: "/Trilhas/" + iIndex });
                } else {
                    this.getView().unbindElement();
                }
            }.bind(this));
        },

        /* Marca mais um módulo como concluído */
        onCompleteModule: function () {
            this._changeProgress(1);
        },

        /* Desfaz o último módulo marcado */
        onUndoModule: function () {
            this._changeProgress(-1);
        },

        /* Atualiza o modelo e guarda o novo valor no navegador */
        _changeProgress: function (iDelta) {
            var oContext = this.getView().getBindingContext();
            var oTrilha = oContext.getObject();
            var iConcluidos = progress.clamp(oTrilha.Concluidos + iDelta, oTrilha.ModulosCount);
            oContext.getModel().setProperty("Concluidos", iConcluidos, oContext);
            progress.save(oTrilha.Id, iConcluidos);
        },

        /* Volta para a página anterior ou para a lista */
        onNavBack: function () {
            if (History.getInstance().getPreviousHash() !== undefined) {
                window.history.go(-1);
            } else {
                UIComponent.getRouterFor(this).navTo("master", {}, true);
            }
        }
    });
});
/* Fim de Detail.controller.js */
