/* Componente da aplicação: carrega o manifesto e inicia o roteador (lista e detalhe) */
sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    return UIComponent.extend("com.douglas.learningportal.Component", {

        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        /* Inicializa o componente e o roteamento */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
        }
    });
});
/* Fim de Component.js */
