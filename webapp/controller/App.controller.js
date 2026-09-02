sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/Button"
], function (Controller, MessageToast, Dialog, Text, Button) {
    "use strict";

    return Controller.extend("com.douglas.learningportal.controller.App", {

        onInit: function () {
            // Inicialização do controller
        },

        /**
         * Retorna o ResourceBundle de internacionalização.
         *
         * @returns {sap.base.i18n.ResourceBundle}
         */
        _getResourceBundle: function () {
            return this.getView()
                .getModel("i18n")
                .getResourceBundle();
        },

        /**
         * Exibe os detalhes da trilha selecionada.
         *
         * @param {sap.ui.base.Event} oEvent Evento de pressão do item.
         */
        onTrilhaPress: function (oEvent) {

            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();
            var oTrilhaData = oContext.getObject();

            var oResourceBundle = this._getResourceBundle();

            // Feedback Fiori
            MessageToast.show(
                oResourceBundle.getText(
                    "selectedTrack",
                    [oTrilhaData.Titulo]
                )
            );

            // Criação do Dialog
            if (!this._oDialog) {

                this._oDialog = new Dialog({
                    title: oResourceBundle.getText("detailDialogTitle"),
                    type: "Message",

                    content: [

                        new Text({
                            text: oResourceBundle.getText(
                                "detailDescription",
                                [oTrilhaData.Descricao]
                            )
                        }),

                        new Text({
                            text: oResourceBundle.getText(
                                "detailHours",
                                [oTrilhaData.Horas]
                            )
                        }),

                        new Text({
                            text: oResourceBundle.getText(
                                "detailModules",
                                [oTrilhaData.ModulosCount]
                            )
                        }),

                        new Text({
                            text: oResourceBundle.getText(
                                "detailStatus",
                                [oTrilhaData.Status]
                            )
                        })

                    ],

                    beginButton: new Button({
                        text: oResourceBundle.getText("closeButton"),

                        press: function () {
                            this._oDialog.close();
                        }.bind(this)
                    })
                });

                this.getView().addDependent(this._oDialog);

            } else {

                // Atualiza os textos do Dialog
                this._oDialog.setTitle(
                    oResourceBundle.getText("detailDialogTitle")
                );

                this._oDialog.getContent()[0].setText(
                    oResourceBundle.getText(
                        "detailDescription",
                        [oTrilhaData.Descricao]
                    )
                );

                this._oDialog.getContent()[1].setText(
                    oResourceBundle.getText(
                        "detailHours",
                        [oTrilhaData.Horas]
                    )
                );

                this._oDialog.getContent()[2].setText(
                    oResourceBundle.getText(
                        "detailModules",
                        [oTrilhaData.ModulosCount]
                    )
                );

                this._oDialog.getContent()[3].setText(
                    oResourceBundle.getText(
                        "detailStatus",
                        [oTrilhaData.Status]
                    )
                );
            }

            this._oDialog.open();
        }

    });
});