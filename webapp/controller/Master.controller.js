/* Lista de trilhas: resumo da jornada, busca, filtro por status, ordenação e navegação para o detalhe */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast",
    "../model/formatter",
    "../model/resumo",
    "../model/favoritos"
], function (Controller, UIComponent, JSONModel, Filter, FilterOperator, Sorter, MessageToast, formatter, resumo, favoritos) {
    "use strict";

    return Controller.extend("com.douglas.learningportal.controller.Master", {

        formatter: formatter,

        /* Modelo da visão com a contagem e o resumo; o resumo é refeito ao voltar do detalhe */
        onInit: function () {
            this.getView().setModel(new JSONModel({ count: "", total: -1, soFavoritas: false, temFavoritas: false, resumo: resumo.resumo([]) }), "view");
            var oModel = this.getOwnerComponent().getModel();
            oModel.dataLoaded().then(this._refresh.bind(this), this._refresh.bind(this));
            UIComponent.getRouterFor(this).getRoute("master").attachPatternMatched(this._refresh, this);
        },

        /* Recalcula contagem e resumo a partir das trilhas atuais */
        _refresh: function () {
            var aTrilhas = this.getOwnerComponent().getModel().getProperty("/Trilhas") || [];
            this.getView().getModel("view").setProperty("/resumo", resumo.resumo(aTrilhas));
            /* A contagem segue a lista: a binding avisa a cada filtro e a cada troca no modelo, como ao tirar um favorito */
            var oBinding = this.byId("trilhasGrid").getBinding("items");
            if (oBinding && !this._bContando) {
                oBinding.attachChange(this._updateCount, this);
                this._bContando = true;
            }
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
            var bSoFavoritas = this.byId("favoriteOnly").getSelected();
            if (bSoFavoritas) {
                aFilters.push(new Filter("Favorita", FilterOperator.EQ, true));
            }
            this.getView().getModel("view").setProperty("/soFavoritas", bSoFavoritas);
            this.byId("trilhasGrid").getBinding("items").filter(aFilters.length ? new Filter({ filters: aFilters, and: true }) : []);
            this._updateCount();
        },

        /* Favorito (#18): o binding já trocou o campo Favorita; aqui grava os Ids e avisa a mudança */
        onFavoritePress: function (oEvent) {
            var aTrilhas = this.getOwnerComponent().getModel().getProperty("/Trilhas") || [];
            var bSalvou = favoritos.save(favoritos.ids(aTrilhas));
            var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            /* Armazenamento bloqueado: a marca vale só até recarregar, e o aviso diz isso */
            var sTexto = !bSalvou ? "favoriteNotSaved" : (oEvent.getParameter("pressed") ? "favoriteAdded" : "favoriteRemoved");
            MessageToast.show(oBundle.getText(sTexto));
        },

        /* Atualiza o texto "N trilhas" e o número que liga o estado vazio
           (antes o estado vazio comparava o texto "0 trilhas" com 0 e nunca aparecia) */
        _updateCount: function () {
            var oBinding = this.byId("trilhasGrid").getBinding("items");
            var iCount = oBinding ? oBinding.getLength() : 0;
            var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            var oViewModel = this.getView().getModel("view");
            oViewModel.setProperty("/total", iCount);
            /* O aviso "nenhuma favorita" só vale quando não há nenhuma marcada; com busca, vale o aviso comum */
            oViewModel.setProperty("/temFavoritas", favoritos.ids(this.getOwnerComponent().getModel().getProperty("/Trilhas") || []).length > 0);
            oViewModel.setProperty("/count", oBundle.getText(iCount === 1 ? "trackCountOne" : "trackCount", [iCount]));
        },

        /* Abre a página de detalhe da trilha escolhida (antes abria um diálogo e a rota de detalhe nunca era usada) */
        onTrilhaPress: function (oEvent) {
            var oTrilha = oEvent.getSource().getBindingContext().getObject();
            UIComponent.getRouterFor(this).navTo("detail", { trilhaId: oTrilha.Id });
        }
    });
});
/* Fim de Master.controller.js */
