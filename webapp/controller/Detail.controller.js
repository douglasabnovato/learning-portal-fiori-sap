sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("com.douglas.learningportal.controller.Detail", {
        
        onInit: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sTrilhaId = oEvent.getParameter("arguments").trilhaId;
            var oView = this.getView();
            var iIndex = parseInt(sTrilhaId, 10) - 1;

            oView.bindElement({
                path: "/Trilhas/" + iIndex
            });
        },

        onNavBack: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("master", {}, true);
        }

    });
});