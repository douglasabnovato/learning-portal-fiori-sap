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
            /* Sem trilhas depois do carregamento: a lista mostra um aviso, em vez de só "0 trilhas" */
            var fnLoaded = function () {
                var aTrilhas = oModel.getProperty("/Trilhas");
                if (!aTrilhas) {
                    oModel.setProperty("/LoadError", true);
                    return;
                }
                oModel.setProperty("/Trilhas", progress.restore(aTrilhas, progress.load()));
            };
            oModel.dataLoaded().then(fnLoaded, fnLoaded);
            this.getRouter().initialize();
        }
    });
});
/* Fim de Component.js */
