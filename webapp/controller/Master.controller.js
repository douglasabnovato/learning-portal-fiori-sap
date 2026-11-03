/* Lista de trilhas: resumo da jornada, busca, filtro por status, ordenação e navegação para o detalhe */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "../model/formatter",
    "../model/resumo"
], function (Controller, UIComponent, JSONModel, Filter, FilterOperator, Sorter, formatter, resumo) {
    "use strict";

    return Controller.extend("com.douglas.learningportal.controller.Master", {

        formatter: formatter,

        /* Modelo da visão com a contagem e o resumo; o resumo é refeito ao voltar do detalhe */
        onInit: function () {
            this.getView().setModel(new JSONModel({ count: "", resumo: resumo.resumo([]) }), "view");
            this.byId("trilhasGrid").attachEvent("updateFinished", this._updateCount, this);
            var oModel = this.getOwnerComponent().getModel();
            oModel.dataLoaded().then(this._refresh.bind(this), this._refresh.bind(this));
            UIComponent.getRouterFor(this).getRoute("master").attachPatternMatched(this._refresh, this);
        },

        /* Recalcula contagem e resumo a partir das trilhas atuais */
        _refresh: function () {
            var aTrilhas = this.getOwnerComponent().getModel().getProperty("/Trilhas") || [];
            this.getView().getModel("view").setProperty("/resumo", resumo.resumo(aTrilhas));
            this._updateCount();
        },

        /* Ordena o catálogo pela chave escolhida */
        onSort: function () {
            var fnCompare = resumo.comparador(this.byId("sortSelect").getSelectedKey());
            /* Sorter com caminho vazio recebe a trilha inteira, como o filtro de status */
            this.byId("trilhasGrid").getBinding("items").sort(fnCompare ? new Sorter({ path: "", comparator: fnCompare }) : []);
        },

        /* Abre a trilha sugerida em "Continuar" */
        onContinue: function () {
            var oContinuar = this.getView().getModel("view").getProperty("/resumo/continuar");
            if (oContinuar) {
                UIComponent.getRouterFor(this).navTo("detail", { trilhaId: oContinuar.Id });
            }
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
