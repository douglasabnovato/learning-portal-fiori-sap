/* Lista de trilhas: busca por título/descrição, filtro por status (calculado) e navegação para o detalhe */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter"
], function (Controller, UIComponent, JSONModel, Filter, FilterOperator, formatter) {
    "use strict";

    return Controller.extend("com.douglas.learningportal.controller.Master", {

        formatter: formatter,

        /* Modelo da visão com a contagem de resultados */
        onInit: function () {
            this.getView().setModel(new JSONModel({ count: "" }), "view");
            this.byId("trilhasGrid").attachEvent("updateFinished", this._updateCount, this);
            var oModel = this.getOwnerComponent().getModel();
            oModel.dataLoaded().then(this._updateCount.bind(this));
        },

        /* Aplica busca e filtro de status juntos */
        onFilter: function () {
            var sQuery = (this.byId("searchField").getValue() || "").trim();
            var sStatus = this.byId("statusFilter").getSelectedKey();
            var aFilters = [];
            if (sQuery) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("Titulo", FilterOperator.Contains, sQuery),
                        new Filter("Descricao", FilterOperator.Contains, sQuery)
                    ],
                    and: false
                }));
            }
            if (sStatus && sStatus !== "all") {
                aFilters.push(new Filter({
                    path: "",
                    test: function (oTrilha) {
                        return formatter.status(oTrilha.Concluidos, oTrilha.ModulosCount) === sStatus;
                    }
                }));
            }
            this.byId("trilhasGrid").getBinding("items").filter(aFilters.length ? new Filter({ filters: aFilters, and: true }) : []);
            this._updateCount();
        },

        /* Atualiza o texto "N trilhas" */
        _updateCount: function () {
            var oBinding = this.byId("trilhasGrid").getBinding("items");
            var iCount = oBinding ? oBinding.getLength() : 0;
            var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            this.getView().getModel("view").setProperty("/count", oBundle.getText(iCount === 1 ? "trackCountOne" : "trackCount", [iCount]));
        },

        /* Abre a página de detalhe da trilha escolhida (antes abria um diálogo e a rota de detalhe nunca era usada) */
        onTrilhaPress: function (oEvent) {
            var oTrilha = oEvent.getSource().getBindingContext().getObject();
            UIComponent.getRouterFor(this).navTo("detail", { trilhaId: oTrilha.Id });
        }
    });
});
/* Fim de Master.controller.js */
