/* Componente da aplicação: carrega o manifesto e inicia o roteador (lista e detalhe) */
sap.ui.define([
    "sap/ui/core/UIComponent",
    "./model/progress"
], function (UIComponent, progress) {
    "use strict";

    return UIComponent.extend("com.douglas.learningportal.Component", {

        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        /* Inicializa o componente e o roteamento */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            var oModel = this.getModel();
            oModel.dataLoaded().then(function () {
                oModel.setProperty("/Trilhas", progress.restore(oModel.getProperty("/Trilhas") || [], progress.load()));
            });
            this.getRouter().initialize();
        }
    });
});
/* Fim de Component.js */
