/* Controller da raiz: aplica a densidade de conteúdo adequada ao dispositivo */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device"
], function (Controller, Device) {
    "use strict";

    return Controller.extend("com.douglas.learningportal.controller.App", {

        /* Usa densidade compacta com mouse e confortável com toque */
        onInit: function () {
            this.getView().addStyleClass(Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact");
        }
    });
});
/* Fim de App.controller.js */
